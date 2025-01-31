import { Component, HostListener, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchable-select',
  imports: [FormsModule],
  templateUrl: './searchable-select.component.html',
  styleUrl: './searchable-select.component.css',
})
export class SearchableSelectComponent {
  filteredOptions: string[] = [];
  isDropdownOpen = false;
  searchText: string = '';
  highlightedIndex = -1;
  selectionChanged = output<string>();
  selectedOption = input.required<string | null>();
  options = input.required<string[]>();

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.searchText = '';
      this.filterOptions();
    } else {
      this.searchText = this.selectedOption() ?? '';
    }
  }

  filterOptions() {
    this.filteredOptions = this.options().filter((option) =>
      option.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.highlightedIndex = -1; // Reset highlight
  }

  selectOption(option: string) {
    this.searchText = option; // Show selected option
    this.isDropdownOpen = false;
    this.selectionChanged.emit(option);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isDropdownOpen = false;
      this.searchText = this.selectedOption() ?? '';
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.isDropdownOpen) return;

    if (event.key === 'ArrowDown') {
      this.highlightedIndex =
        (this.highlightedIndex + 1) % this.filteredOptions.length;
    } else if (event.key === 'ArrowUp') {
      this.highlightedIndex =
        (this.highlightedIndex - 1 + this.filteredOptions.length) %
        this.filteredOptions.length;
    } else if (event.key === 'Enter' && this.highlightedIndex !== -1) {
      this.selectOption(this.filteredOptions[this.highlightedIndex]);
    }
  }
}
