import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LangToggle } from "@/components/site";
import { I18nProvider, useI18n } from "./i18n";

function Copy() {
  const { t } = useI18n();
  return <p>{t("welcome")}</p>;
}

describe("language preference", () => {
  beforeEach(() => localStorage.clear());

  it("switches English to Bangla and back without leaving the provider", () => {
    render(<I18nProvider><LangToggle /><Copy /></I18nProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Switch language" }));
    expect(screen.getByText("বাংলাদেশে স্বাগতম")).toBeInTheDocument();
    expect(localStorage.getItem("ghuri-lang")).toBe("bn");
    fireEvent.click(screen.getByRole("button", { name: "ভাষা পরিবর্তন" }));
    expect(screen.getByText("Welcome to Bangladesh")).toBeInTheDocument();
    expect(localStorage.getItem("ghuri-lang")).toBe("en");
  });

  it("restores the saved language after remount", async () => {
    localStorage.setItem("ghuri-lang", "bn");
    render(<I18nProvider><Copy /></I18nProvider>);
    await waitFor(() => expect(screen.getByText("বাংলাদেশে স্বাগতম")).toBeInTheDocument());
    expect(document.documentElement.lang).toBe("bn");
  });
});
