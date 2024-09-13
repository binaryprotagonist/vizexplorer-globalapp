import { fireEvent, render, waitFor } from "@testing-library/react";
import { OrgCreateForm } from "./org-create-form";
import { getInput, updateInput } from "testing/utils";
import { OrgCreateFormInput } from "./types";

describe("<OrgCreateForm />", () => {
  it("renders", async () => {
    const { findByTestId } = render(<OrgCreateForm />);

    // due to lazy loaded phone component, need to wait
    await findByTestId("org-create-form");
  });

  it("displays helper text if the org name is taken", async () => {
    const { findByTestId, getByTestId, getByText } = render(
      <OrgCreateForm takenOrgNames={new Set(["my org"])} />
    );

    await findByTestId("org-create-form");

    updateInput(getByTestId("org-name"), "My Org");

    expect(getByText("This name already exists", { exact: false })).toBeInTheDocument();
  });

  it("displays helper text if the email is invalid", async () => {
    const { findByTestId, getByTestId, getByText } = render(<OrgCreateForm />);

    await findByTestId("org-create-form");

    updateInput(getByTestId("email"), "invalid-email");

    expect(getByText("Please enter a valid email address")).toBeInTheDocument();
  });

  it("displays helper text if the phone number is invalid", async () => {
    const { findByTestId, getByLabelText, findByText, rerender } = render(
      <OrgCreateForm />
    );

    await findByTestId("org-create-form");

    updateInput(getByLabelText("Phone number"), "123");
    // not sure why, but without a rerender, the phone number isn't updated. doesn't happen when running live
    rerender(<OrgCreateForm />);

    await findByText("Please enter a valid phone number");
  });

  it("enables save when required fields are filled", async () => {
    const { findByTestId, getByTestId, getByText, getByLabelText } = render(
      <OrgCreateForm />
    );

    await findByTestId("org-create-form");

    expect(getByText("Save")).toBeDisabled();

    updateInput(getByTestId("org-name"), "My Org");
    updateInput(getByTestId("email"), "myorg@test.com");
    updateInput(getByLabelText("Phone number"), "2015550123");
    updateInput(getByTestId("address-line-1"), "123 Fake St");
    updateInput(getByTestId("city"), "Springfield");
    updateInput(getByTestId("zip"), "123");

    // wait for phone input promise to resolve
    await waitFor(() => {});

    expect(getByText("Save")).toBeEnabled();
  });

  it("disables save if all fields are valid but org name is taken", async () => {
    const { findByTestId, getByTestId, getByText, getByLabelText } = render(
      <OrgCreateForm takenOrgNames={new Set(["my org"])} />
    );

    await findByTestId("org-create-form");

    updateInput(getByTestId("org-name"), "My Org");
    updateInput(getByTestId("email"), "myorg@test.com");
    updateInput(getByLabelText("Phone number"), "2015550123");
    updateInput(getByTestId("address-line-1"), "123 Fake St");
    updateInput(getByTestId("city"), "Springfield");
    updateInput(getByTestId("zip"), "123");

    await waitFor(() => {});

    expect(getByText("Save")).toBeDisabled();
  });

  it("disables save if all fields are valid but email is invalid", async () => {
    const { findByTestId, getByTestId, getByText, getByLabelText } = render(
      <OrgCreateForm />
    );

    await findByTestId("org-create-form");

    updateInput(getByTestId("org-name"), "My Org");
    updateInput(getByTestId("email"), "invalid-email");
    updateInput(getByLabelText("Phone number"), "2015550123");
    updateInput(getByTestId("address-line-1"), "123 Fake St");
    updateInput(getByTestId("city"), "Springfield");
    updateInput(getByTestId("zip"), "123");

    await waitFor(() => {});

    expect(getByText("Save")).toBeDisabled();
  });

  it("disables save if all fields are valid but phone number is invalid", async () => {
    const { findByTestId, getByTestId, getByText, getByLabelText } = render(
      <OrgCreateForm />
    );

    await findByTestId("org-create-form");

    updateInput(getByTestId("org-name"), "My Org");
    updateInput(getByTestId("email"), "myorg@test.com");
    updateInput(getByLabelText("Phone number"), "123");
    updateInput(getByTestId("address-line-1"), "123 Fake St");
    updateInput(getByTestId("city"), "Springfield");
    updateInput(getByTestId("zip"), "123");

    await waitFor(() => {});

    expect(getByText("Save")).toBeDisabled();
  });

  it("disables all fields and actions if saving is true", async () => {
    const { findByTestId, getByTestId, getByText, getByLabelText } = render(
      <OrgCreateForm saving />
    );

    await findByTestId("org-create-form");

    expect(getInput(getByTestId("org-name"))).toBeDisabled();
    expect(getInput(getByTestId("email"))).toBeDisabled();
    expect(getByLabelText("Phone number")).toBeDisabled();
    expect(getInput(getByTestId("address-line-1"))).toBeDisabled();
    expect(getInput(getByTestId("address-line-2"))).toBeDisabled();
    expect(getInput(getByTestId("city"))).toBeDisabled();
    expect(getInput(getByTestId("state"))).toBeDisabled();
    expect(getInput(getByTestId("zip"))).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
    expect(getByTestId("save-btn")).toBeDisabled();
    expect(getByTestId("save-btn")).not.toHaveTextContent("Save");
  });

  it("disables all fields and save if loading is true", async () => {
    const { findByTestId, getByTestId, getByText, getByLabelText } = render(
      <OrgCreateForm loading />
    );

    await findByTestId("org-create-form");

    expect(getInput(getByTestId("org-name"))).toBeDisabled();
    expect(getInput(getByTestId("email"))).toBeDisabled();
    expect(getByLabelText("Phone number")).toBeDisabled();
    expect(getInput(getByTestId("address-line-1"))).toBeDisabled();
    expect(getInput(getByTestId("address-line-2"))).toBeDisabled();
    expect(getInput(getByTestId("city"))).toBeDisabled();
    expect(getInput(getByTestId("state"))).toBeDisabled();
    expect(getInput(getByTestId("zip"))).toBeDisabled();
    expect(getByTestId("save-btn")).toBeDisabled();
    expect(getByTestId("save-btn")).toHaveTextContent("Save");

    expect(getByText("Cancel")).toBeEnabled();
  });

  it("calls onCancel when cancel is clicked", async () => {
    const onCancel = jest.fn();
    const { findByTestId, getByText } = render(<OrgCreateForm onCancel={onCancel} />);

    await findByTestId("org-create-form");

    fireEvent.click(getByText("Cancel"));

    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onSubmit when save is clicked", async () => {
    const onSubmit = jest.fn();
    const { findByTestId, getByTestId, getByText, getByLabelText } = render(
      <OrgCreateForm onSubmit={onSubmit} />
    );

    await findByTestId("org-create-form");

    updateInput(getByTestId("org-name"), "My Org");
    updateInput(getByTestId("email"), "myorg@test.com");
    updateInput(getByLabelText("Phone number"), "2015550123");
    updateInput(getByTestId("address-line-1"), "123 Fake St");
    updateInput(getByTestId("city"), "Springfield");
    updateInput(getByTestId("zip"), "123");

    await waitFor(() => {});

    fireEvent.click(getByText("Save"));

    const expected: OrgCreateFormInput = {
      name: "My Org",
      email: "myorg@test.com",
      phone: "+12015550123",
      addressLine1: "123 Fake St",
      addressLine2: "",
      city: "Springfield",
      state: "",
      zip: "123",
      country: "us"
    };
    expect(onSubmit).toHaveBeenCalledWith(expected);
  });
});
