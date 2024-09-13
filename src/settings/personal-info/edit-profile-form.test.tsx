import { fireEvent, render, waitFor } from "@testing-library/react";
import { EditProfileForm } from "./edit-profile-form";
import {
  MockRecoilProvider,
  MockAuthProvider,
  MockGraphQLProvider
} from "@vizexplorer/global-ui-core";
import { GaUserFragment, UserProfileInput } from "generated-graphql";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";
import { InMemoryCache } from "@apollo/client";
import { mockAdmin, mockEmailExists, mockUserProfileUpdate } from "testing/mocks";
import { ThemeProvider } from "../../theme";
import { updateInput } from "testing/utils";

describe("<EditProfileForm />", () => {
  let updatedProfile: UserProfileInput = null as any;
  let editingUser: GaUserFragment = null as any;
  let history: History = null as any;
  let emailExists = false;
  const cache = new InMemoryCache();

  beforeEach(() => {
    history = createMemoryHistory();
    editingUser = { ...mockAdmin };
    updatedProfile = {
      userId: editingUser.id,
      firstName: "Updated FN",
      lastName: "Updated LN",
      email: "updated@profile.com",
      phone: "Updated Phone"
    };
    emailExists = false;
    cache.restore({});
  });

  function wrapper({ children }: any) {
    return (
      <MockRecoilProvider>
        <MockAuthProvider>
          <MockGraphQLProvider
            cache={cache as any}
            mocks={[
              mockUserProfileUpdate(updatedProfile),
              mockUserProfileUpdate(updatedProfile),
              mockEmailExists(updatedProfile.email!, emailExists),
              mockEmailExists(updatedProfile.email!, emailExists),
              mockEmailExists("email-exists@email.com", true)
            ]}
          >
            <ThemeProvider>
              <Router navigator={history} location={history.location}>
                {children}
              </Router>
            </ThemeProvider>
          </MockGraphQLProvider>
        </MockAuthProvider>
      </MockRecoilProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <EditProfileForm user={editingUser} onDone={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("edit-profile-form")).toBeInTheDocument();
  });

  it("renders fields", () => {
    const { getByTestId } = render(
      <EditProfileForm user={editingUser} onDone={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("first-name-input")).toBeInTheDocument();
    expect(getByTestId("last-name-input")).toBeInTheDocument();
    expect(getByTestId("email-input")).toBeInTheDocument();
    expect(getByTestId("phone-input")).toBeInTheDocument();
  });

  it("renders errors on submit if any field is blank", async () => {
    const blankUser: GaUserFragment = {
      ...editingUser,
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    };
    const { getByText } = render(<EditProfileForm user={blankUser} onDone={() => {}} />, {
      wrapper
    });

    fireEvent.submit(getByText("Submit"));

    await waitFor(() => {
      expect(getByText("First Name can't be blank")).toBeInTheDocument();
    });
    expect(getByText("Last Name can't be blank")).toBeInTheDocument();
    expect(getByText("Work Email can't be blank")).toBeInTheDocument();
  });

  it("renders an error if the email format is not valid", async () => {
    const invalidEmail = { ...editingUser, email: "missing.at.symbol" };
    const { getByText } = render(
      <EditProfileForm user={invalidEmail} onDone={() => {}} />,
      { wrapper }
    );

    fireEvent.submit(getByText("Submit"));

    await waitFor(() => {
      expect(getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("renders `Email Taken` error if email is taken", async () => {
    emailExists = true;
    const { getByText, getByTestId } = render(
      <EditProfileForm user={editingUser} onDone={() => {}} />,
      { wrapper }
    );

    const emailInput = getByTestId("email-input").querySelector("input")!;
    fireEvent.change(emailInput, { target: { value: updatedProfile.email } });

    await waitFor(() => {
      expect(getByText("Email is taken")).toBeInTheDocument();
    });
  });

  it("dismisses `Email Taken` error upon changing the email input", async () => {
    emailExists = true;
    const { queryByText, getByText, getByTestId } = render(
      <EditProfileForm user={editingUser} onDone={() => {}} />,
      { wrapper }
    );

    updateInput(getByTestId("email-input"), updatedProfile.email);
    await waitFor(() => {
      expect(getByText("Email is taken")).toBeInTheDocument();
    });

    updateInput(getByTestId("email-input"), "email-exists@email.com");

    await waitFor(() => {
      expect(queryByText("Email is taken")).not.toBeInTheDocument();
    });
  });

  it("runs onDone upon successful profile update", async () => {
    const onDone = jest.fn();
    const { getByText, getByTestId } = render(
      <EditProfileForm user={editingUser} onDone={onDone} />,
      { wrapper }
    );

    updateInput(getByTestId("first-name-input"), updatedProfile.firstName);
    updateInput(getByTestId("last-name-input"), updatedProfile.lastName);
    updateInput(getByTestId("email-input"), updatedProfile.email);
    updateInput(getByTestId("phone-input"), updatedProfile.phone);

    fireEvent.submit(getByText("Submit"));
    await waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });
  });

  it("doesn't display `Email Taken` error if the existing email is the users own email", async () => {
    const onDone = jest.fn();
    emailExists = true;
    editingUser = { ...editingUser, email: updatedProfile.email! };
    const { getByText, getByTestId, queryByText } = render(
      <EditProfileForm user={editingUser} onDone={onDone} />,
      { wrapper }
    );

    updateInput(getByTestId("first-name-input"), updatedProfile.firstName);
    updateInput(getByTestId("last-name-input"), updatedProfile.lastName);
    updateInput(getByTestId("email-input"), updatedProfile.email);
    updateInput(getByTestId("phone-input"), updatedProfile.phone);

    fireEvent.submit(getByText("Submit"));

    await waitFor(() => {
      expect(queryByText("Email is taken")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(onDone).toHaveBeenCalled();
    });
  });

  it("updates user information stored in cache", async () => {
    const cacheId = `User:${updatedProfile.userId}`;
    const { getByText, getByTestId } = render(
      <EditProfileForm user={editingUser} onDone={() => {}} />,
      { wrapper }
    );

    expect(Object.keys(cache.extract())).not.toContain(cacheId);
    updateInput(getByTestId("first-name-input"), updatedProfile.firstName);
    updateInput(getByTestId("last-name-input"), updatedProfile.lastName);
    updateInput(getByTestId("email-input"), updatedProfile.email);
    updateInput(getByTestId("phone-input"), updatedProfile.phone);

    fireEvent.submit(getByText("Submit"));

    await waitFor(() => {
      expect(Object.keys(cache.extract())).toContain(cacheId);
    });
  });

  it("runs onDone when `Cancel` is clicked", () => {
    const onDone = jest.fn();
    const { getByText } = render(<EditProfileForm user={editingUser} onDone={onDone} />, {
      wrapper
    });

    fireEvent.click(getByText("Cancel"));
    expect(onDone).toHaveBeenCalled();
  });
});
