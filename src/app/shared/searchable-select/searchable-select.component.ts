import { Component, HostListener, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchable-select',
  imports: [FormsModule],
  templateUrl: './searchable-select.component.html',
  styleUrl: './searchable-select.component.css',
})
export class SearchableSelectComponent implements OnInit {
  filteredOptions: string[] = [];
  isDropdownOpen = false;
  searchText: string = '';
  highlightedIndex = -1;
  onSelectionChanged = output<string | null>();
  selectedOption = input.required<string | null>();
  emptyLabel = input<string>('Empty');
  options = input.required<string[]>();

  ngOnInit(): void {
    this.searchText = this.selectedOption() ?? this.emptyLabel();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.searchText = '';
      this.filterOptions();
      const selectedOptionsIndex = this.filteredOptions.findIndex(
        (option) => option === this.selectedOption()
      );
      this.highlightedIndex = selectedOptionsIndex;

      console.log(selectedOptionsIndex);
    } else {
      this.searchText = this.selectedOption() ?? '';
    }
  }

  filterOptions() {
    this.filteredOptions = this.options().filter((option) =>
      option.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.highlightedIndex = -1;
  }

  onSelectOption(option: string | null) {
    this.searchText = option ?? this.emptyLabel();
    this.isDropdownOpen = false;
    this.onSelectionChanged.emit(option);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isDropdownOpen = false;
      this.searchText = this.selectedOption() ?? this.emptyLabel();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.isDropdownOpen) return;

    const maxItemIndex = this.filteredOptions.length - 1;
    if (event.key === 'ArrowDown') {
      const incrementedIndex = this.highlightedIndex + 1;
      this.highlightedIndex =
        incrementedIndex > maxItemIndex ? -1 : incrementedIndex;
    } else if (event.key === 'ArrowUp') {
      const decrementedIndex = this.highlightedIndex - 1;
      this.highlightedIndex =
        decrementedIndex < -1 ? maxItemIndex : decrementedIndex;
    } else if (event.key === 'Enter' && this.highlightedIndex !== -1) {
      this.onSelectOption(this.filteredOptions[this.highlightedIndex]);
    }
  }
}
