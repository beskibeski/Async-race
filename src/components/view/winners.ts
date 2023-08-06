import { getServerWinnersCar, getServerGarageCar } from '../api/api';
import { TWinners, IWinner, TSorting } from '../types/types';
import { carImage } from '../elements/car';
import { nextPage, previousPage, pagination } from './pagination';
import { Sorting } from '../types/enums';
import {
  SortingSymbol, sortingMethodChange, sortingWinnersByBestTime, sortingWinnersByWins,
} from './sorting';

export default class Winners {
  private winnersTitle: string;

  private winnersCarsCount: number;

  private winnersPageNumber: number;

  private maxNumberOfCarsPerPage: number;

  private isSortedByWins: TSorting;

  private isSortedbyBestTime: TSorting;

  constructor() {
    this.winnersTitle = 'Winners';
    this.winnersCarsCount = 0;
    this.winnersPageNumber = 1;
    this.maxNumberOfCarsPerPage = 10;
    this.isSortedByWins = Sorting.not;
    this.isSortedbyBestTime = Sorting.not;
  }

  public create = (): void => {
    const body = document.querySelector('.body') as HTMLElement;
    const winnersFlex = document.createElement('div') as HTMLElement;
    body.append(winnersFlex);
    winnersFlex.classList.add('winners');
    const winnerName = document.createElement('div') as HTMLElement;
    winnerName.innerText = `${this.winnersTitle} (${this.winnersCarsCount})`;
    getServerWinnersCar().then((data): void => {
      this.winnersCarsCount = data.length;
      winnerName.innerText = `${this.winnersTitle} (${this.winnersCarsCount})`;
    });
    winnersFlex.append(winnerName);
    const winnerPage = document.createElement('div') as HTMLElement;
    winnerPage.innerText = `Page #${this.winnersPageNumber}`;
    winnersFlex.append(winnerPage);
    const winnersTable = document.createElement('table') as HTMLElement;
    winnersTable.classList.add('winners__table');
    winnersFlex.append(winnersTable);
    const winnersTableHead = document.createElement('thead') as HTMLElement;
    winnersTable.append(winnersTableHead);
    const winnersTableHeadRow = document.createElement('tr') as HTMLElement;
    winnersTableHead.append(winnersTableHeadRow);
    const winnerNumberHeading = document.createElement('th') as HTMLElement;
    winnerNumberHeading.innerText = 'Number';
    winnerNumberHeading.classList.add('winners__table-heading');
    winnersTableHeadRow.append(winnerNumberHeading);
    const winnersCarColorHeading = document.createElement('th') as HTMLElement;
    winnersCarColorHeading.innerText = 'Car';
    winnersCarColorHeading.classList.add('winners__table-heading');
    winnersTableHeadRow.append(winnersCarColorHeading);
    const winnersCarNameHeading = document.createElement('th') as HTMLElement;
    winnersCarNameHeading.innerText = 'Name';
    winnersCarNameHeading.classList.add('winners__table-heading');
    winnersTableHeadRow.append(winnersCarNameHeading);
    const winnersCarWinsHeading = document.createElement('th') as HTMLElement;
    winnersCarWinsHeading.innerText = 'Wins';
    winnersCarWinsHeading.classList.add('winners__table-heading');
    winnersTableHeadRow.append(winnersCarWinsHeading);
    const buttonWinnersCarWinsSorting = document.createElement('div') as HTMLElement;
    buttonWinnersCarWinsSorting.classList.add('winners__win-sorting');
    buttonWinnersCarWinsSorting.innerText = SortingSymbol.not;
    winnersCarWinsHeading.append(buttonWinnersCarWinsSorting);
    const winnersCarBestTimeHeading = document.createElement('th') as HTMLElement;
    winnersCarBestTimeHeading.innerText = 'Best time (seconds)';
    winnersCarBestTimeHeading.classList.add('winners__table-heading');
    winnersTableHeadRow.append(winnersCarBestTimeHeading);
    const buttonWinnersCarBestTimeSorting = document.createElement('div') as HTMLElement;
    buttonWinnersCarBestTimeSorting.classList.add('winners__time-sorting');
    buttonWinnersCarBestTimeSorting.innerText = SortingSymbol.not;
    winnersCarBestTimeHeading.append(buttonWinnersCarBestTimeSorting);
    const winnersTableBody = document.createElement('tbody') as HTMLElement;
    winnersTable.append(winnersTableBody);
    const buttonsFlex = document.createElement('div') as HTMLElement;
    buttonsFlex.classList.add('buttons');
    winnersFlex.append(buttonsFlex);
    const buttonPrev = document.createElement('div') as HTMLElement;
    buttonPrev.innerText = 'PREV';
    buttonPrev.classList.add('button');
    buttonsFlex.append(buttonPrev);
    const buttonNext = document.createElement('div') as HTMLElement;
    buttonNext.innerText = 'NEXT';
    buttonNext.classList.add('button');
    buttonsFlex.append(buttonNext);
    buttonPrev.classList.add('inactive');
    buttonNext.addEventListener('click', (): void => {
      nextPage(
        this.winnersPageNumber,
        buttonNext,
        winnerPage,
        this.winnersCarsCount,
        this.maxNumberOfCarsPerPage,
      );
      this.winnersPageNumber += 1;
      getCar();
    });
    buttonPrev.addEventListener('click', (): void => {
      previousPage(this.winnersPageNumber, buttonPrev, winnerPage);
      this.winnersPageNumber -= 1;
      getCar();
    });
    buttonWinnersCarWinsSorting.addEventListener('click', (): void => {
      this.isSortedByWins = sortingMethodChange(this.isSortedByWins, buttonWinnersCarWinsSorting);
      this.isSortedbyBestTime = Sorting.not;
      getCar();
    });
    buttonWinnersCarBestTimeSorting.addEventListener('click', (): void => {
      this.isSortedbyBestTime = sortingMethodChange(this.isSortedbyBestTime, buttonWinnersCarBestTimeSorting);
      this.isSortedByWins = Sorting.not;
      getCar();
    });
    const getCar = (): void => {
      getServerWinnersCar().then((data: TWinners): void => {
        let countCreatedBlocks = 0;
        sortingWinnersByWins(this.isSortedByWins, data);
        sortingWinnersByBestTime(this.isSortedbyBestTime, data);
        winnersTableBody.innerHTML = '';
        pagination(
          this.winnersCarsCount,
          this.winnersPageNumber,
          this.maxNumberOfCarsPerPage,
          buttonPrev,
          buttonNext,
        );
        data.forEach((element: IWinner): void => {
          if (
            countCreatedBlocks !== this.maxNumberOfCarsPerPage
                        && data.indexOf(element)
                            >= this.winnersPageNumber * this.maxNumberOfCarsPerPage - this.maxNumberOfCarsPerPage
          ) {
            const winnerCarBlock = document.createElement('tr');
            winnersTableBody.append(winnerCarBlock);
            const number = document.createElement('td') as HTMLElement;
            number.innerText = `${data.indexOf(element) + 1}`;
            const wins = document.createElement('td') as HTMLElement;
            wins.innerText = `${element.wins}`;
            const bestTime = document.createElement('td') as HTMLElement;
            bestTime.innerText = `${element.time}`;
            const carColor = document.createElement('td') as HTMLElement;
            carColor.classList.add('winners__car-image');
            const carName = document.createElement('td') as HTMLElement;
            const carIndex = element.id;
            countCreatedBlocks += 1;
            getServerGarageCar().then((newData): void => {
              newData.forEach((newElement): void => {
                if (newElement.id === carIndex) {
                  carColor.innerHTML = carImage(`${newElement.color}`);
                  carName.innerText = `${newElement.name}`;
                }
              });
              winnerCarBlock.append(number);
              winnerCarBlock.append(carColor);
              winnerCarBlock.append(carName);
              winnerCarBlock.append(wins);
              winnerCarBlock.append(bestTime);
            });
          }
        });
      });
    };
    getCar();
  };
}
