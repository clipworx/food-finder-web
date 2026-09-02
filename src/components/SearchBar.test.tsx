import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { SearchBar } from "./SearchBar";

function renderWithLocale(ui: React.ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}

describe("SearchBar", () => {
  it("does not call onSearch for an empty query", () => {
    const onSearch = vi.fn();
    renderWithLocale(<SearchBar onSearch={onSearch} isSearching={false} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("calls onSearch with the trimmed query on submit", () => {
    const onSearch = vi.fn();
    renderWithLocale(<SearchBar onSearch={onSearch} isSearching={false} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  peanut butter  " },
    });
    fireEvent.click(screen.getByRole("button"));

    expect(onSearch).toHaveBeenCalledWith("peanut butter");
  });

  it("disables the button while a search is in progress", () => {
    renderWithLocale(<SearchBar onSearch={vi.fn()} isSearching={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
