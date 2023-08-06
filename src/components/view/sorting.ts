import { Sorting } from '../types/enums';
import { TSorting, TWinners } from '../types/types';

export const sortingWinnersByWins = (value: TSorting, data: TWinners): void => {
  if (value === Sorting.asc) {
    data.sort((a, b) => a.wins - b.wins);
  } else if (value === Sorting.dsc) {
    data.sort((a, b) => b.wins - a.wins);
  }
};

export const sortingWinnersByBestTime = (value: TSorting, data: TWinners): void => {
  if (value === Sorting.asc) {
    data.sort((a, b) => a.time - b.time);
  } else if (value === Sorting.dsc) {
    data.sort((a, b) => b.time - a.time);
  }
};

export const sortingMethodChange = (sorting: Sorting, sortingBlock: HTMLElement) => {
  if (sorting === Sorting.not) {
    sorting = Sorting.asc;
    sortingBlock.innerText = SortingSymbol.asc;
  } else if (sorting === Sorting.asc) {
    sorting = Sorting.dsc;
    sortingBlock.innerText = SortingSymbol.dsc;
  } else if (sorting === Sorting.dsc) {
    sorting = Sorting.not;
    sortingBlock.innerText = SortingSymbol.not;
  }
  return sorting;
};

export enum SortingSymbol {
  not = '♦',
  asc = '↑',
  dsc = '↓',
}
