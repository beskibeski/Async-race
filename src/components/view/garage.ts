import {
  carImage, flagImage, generateCarName, generateCarColor,
} from '../elements/car';
import {
  deleteServerGarageCar,
  deleteWinnersCar,
  getServerGarageCar,
  getServerWinnersCar,
  putServerGarageCar,
  updateServerGarageCar,
} from '../api/api';
import './index.css';
import './buttons.css';
import { TCars, ICar } from '../types/types';
import {
  changeButtonsStateForRacing,
  makeRaceButtonActive,
  makeResetButtonInActive,
  startDrivingGarageCar,
  resetAllCars,
  stopDrivingGarageCar,
  winnerCarsResultToNull,
} from './car-riding';
import { nextPage, pagination, previousPage } from './pagination';

export default class Garage {
  private garageTitle: string;

  private garageCarsCount: number;

  private garagePageNumber: number;

  private maxNumberOfCarsPerPage: number;

  private selectedCarId: number;

  private selectedButtonActive: boolean;

  public static isRace: boolean;

  constructor() {
    this.garageTitle = 'Garage';
    this.garageCarsCount = 0;
    this.garagePageNumber = 1;
    this.maxNumberOfCarsPerPage = 7;
    this.selectedCarId = NaN;
    this.selectedButtonActive = false;
    Garage.isRace = false;
  }

  public create = (): void => {
    const body = document.querySelector('.body') as HTMLElement;
    const garageFlex = document.createElement('div') as HTMLElement;
    body.append(garageFlex);
    garageFlex.classList.add('garage');
    garageFlex.classList.add('active');
    const garageCreationFlex = document.createElement('div') as HTMLElement;
    garageCreationFlex.classList.add('car-creation');
    garageFlex.append(garageCreationFlex);
    const garageInputCreate = document.createElement('div') as HTMLElement;
    garageInputCreate.classList.add('car-creation__create');
    garageCreationFlex.append(garageInputCreate);
    const garageInputCreateArea = document.createElement('input');
    garageInputCreateArea.classList.add('car-creation__input');
    garageInputCreateArea.setAttribute('placeholder', 'Enter car name');
    garageInputCreate.append(garageInputCreateArea);
    const garageInputCreateColor = document.createElement('input');
    garageInputCreateColor.classList.add('car-creation__input-color');
    garageInputCreateColor.setAttribute('type', 'color');
    garageInputCreate.append(garageInputCreateColor);
    const garageInputCreateButton = document.createElement('div') as HTMLElement;
    garageInputCreateButton.classList.add('button');
    garageInputCreateButton.classList.add('button-create');
    garageInputCreateButton.classList.add('inactive');
    garageInputCreateButton.innerText = 'CREATE';
    garageInputCreate.append(garageInputCreateButton);
    const garageInputUpdate = document.createElement('div') as HTMLElement;
    garageInputUpdate.classList.add('car-creation__update');
    garageCreationFlex.append(garageInputUpdate);
    const garageInputUpdateArea = document.createElement('input');
    garageInputUpdateArea.classList.add('car-creation__input');
    garageInputUpdateArea.setAttribute('placeholder', 'Enter car name');
    garageInputUpdateArea.setAttribute('disabled', 'true');
    garageInputUpdate.append(garageInputUpdateArea);
    const garageInputUpdateColor = document.createElement('input');
    garageInputUpdateColor.classList.add('car-creation__input-color');
    garageInputUpdateColor.setAttribute('type', 'color');
    garageInputUpdate.append(garageInputUpdateColor);
    const garageInputUpdateButton = document.createElement('div') as HTMLElement;
    garageInputUpdateButton.classList.add('button');
    garageInputUpdateButton.innerText = 'UPDATE';
    garageInputUpdateButton.classList.add('inactive');
    garageInputUpdate.append(garageInputUpdateButton);
    garageInputUpdateArea.addEventListener('change', (): void => {
      garageInputUpdateArea.blur();
    });
    garageInputUpdateArea.addEventListener('input', (): void => {
      if (garageInputUpdateArea.value.length > 0) {
        garageInputUpdateButton.classList.remove('inactive');
      } else if (garageInputUpdateButton.classList.contains('inactive')) {
        garageInputUpdateButton.classList.remove('inactive');
      }
    });
    garageInputUpdateArea.addEventListener('keyup', (event): void => {
      if (event.code === 'Enter') {
        garageInputUpdateArea.blur();
      }
    });
    garageInputUpdateButton.addEventListener('click', (): void => {
      updateServerGarageCar(this.selectedCarId, {
        name: garageInputUpdateArea.value,
        color: garageInputUpdateColor.value,
      }).then(() => {
        getCar();
      });
      garageInputUpdateButton.classList.add('inactive');
      garageInputUpdateArea.value = '';
      garageInputUpdateArea.setAttribute('disabled', 'true');
    });
    const buttonsCreateFlex = document.createElement('div') as HTMLElement;
    buttonsCreateFlex.classList.add('buttons');
    garageCreationFlex.append(buttonsCreateFlex);
    const buttonRace = document.createElement('div') as HTMLElement;
    buttonRace.innerText = 'RACE';
    buttonRace.classList.add('button');
    buttonRace.classList.add('button-race');
    buttonsCreateFlex.append(buttonRace);
    const buttonReset = document.createElement('div') as HTMLElement;
    buttonReset.innerText = 'RESET';
    buttonReset.classList.add('button');
    buttonReset.classList.add('inactive');
    buttonReset.classList.add('button-reset');
    buttonsCreateFlex.append(buttonReset);
    const buttonGenerate = document.createElement('div') as HTMLElement;
    buttonGenerate.innerText = 'GENERATE CARS';
    buttonGenerate.classList.add('button');
    buttonsCreateFlex.append(buttonGenerate);
    buttonGenerate.addEventListener('click', (): void => {
      for (let i = 0; i < 100; i += 1) {
        putServerGarageCar({ name: generateCarName(), color: generateCarColor() }).then();
      }
      getCar();
    });
    const garageName = document.createElement('div') as HTMLElement;
    garageName.innerText = `${this.garageTitle} (${this.garageCarsCount})`;
    garageFlex.append(garageName);
    const garagePage = document.createElement('div') as HTMLElement;
    garagePage.innerText = `Page #${this.garagePageNumber}`;
    garageFlex.append(garagePage);
    const carsFlex = document.createElement('div') as HTMLElement;
    carsFlex.classList.add('garage-cars');
    garageFlex.append(carsFlex);
    garageInputCreateButton.addEventListener('click', (): void => {
      if (garageInputCreateArea.value === '') {
        alert('Please enter the car name');
      } else {
        putServerGarageCar({
          name: garageInputCreateArea.value,
          color: garageInputCreateColor.value,
        }).then(() => {
          getCar();
        });
      }
      garageInputCreateArea.value = '';
      garageInputCreateButton.classList.add('inactive');
    });
    garageInputCreateArea.addEventListener('input', (): void => {
      if (garageInputCreateArea.value.length > 0) {
        garageInputCreateButton.classList.remove('inactive');
      } else if (!garageInputCreateButton.classList.contains('inactive')) {
        garageInputCreateButton.classList.add('inactive');
      }
    });
    garageInputCreateArea.addEventListener('keyup', (event): void => {
      if (event.code === 'Enter') {
        garageInputCreateArea.blur();
      }
    });
    const buttonsFlex = document.createElement('div') as HTMLElement;
    buttonsFlex.classList.add('buttons');
    garageFlex.append(buttonsFlex);
    const buttonPrev = document.createElement('div') as HTMLElement;
    buttonPrev.innerText = 'PREV';
    buttonPrev.classList.add('button');
    buttonsFlex.append(buttonPrev);
    const buttonNext = document.createElement('div') as HTMLElement;
    buttonNext.innerText = 'NEXT';
    buttonNext.classList.add('button');
    buttonsFlex.append(buttonNext);
    buttonPrev.classList.add('inactive');
    buttonNext.classList.add('inactive');
    buttonNext.addEventListener('click', (): void => {
      nextPage(this.garagePageNumber, buttonNext, garagePage, this.garageCarsCount, this.maxNumberOfCarsPerPage);
      this.garagePageNumber += 1;
      getCar();
    });
    buttonPrev.addEventListener('click', (): void => {
      previousPage(this.garagePageNumber, buttonPrev, garagePage);
      this.garagePageNumber -= 1;
      getCar();
    });
    buttonRace.addEventListener('click', (): void => {
      const allCars = document.querySelectorAll('.garage-cars__car-image');
      changeButtonsStateForRacing();
      buttonReset.classList.remove('inactive');
      buttonRace.classList.add('inactive');
      winnerCarsResultToNull();
      Garage.isRace = true;
      allCars.forEach((element): void => {
        startDrivingGarageCar(Number(element.parentElement?.parentElement?.id));
      });
    });
    buttonReset.addEventListener('click', (): void => {
      getCar();
      buttonReset.classList.add('inactive');
      buttonRace.classList.remove('inactive');
    });
    const getCar = () => getServerGarageCar().then((data: TCars): void => {
      makeRaceButtonActive();
      makeResetButtonInActive();
      resetAllCars();
      winnerCarsResultToNull();
      carsFlex.innerHTML = '';
      this.garageCarsCount = data.length;
      garageName.innerText = `${this.garageTitle} ${this.garageCarsCount}`;
      let countCreatedBlocks = 0;
      pagination(
        this.garageCarsCount,
        this.garagePageNumber,
        this.maxNumberOfCarsPerPage,
        buttonPrev,
        buttonNext,
      );
      data.forEach((element: ICar): void => {
        if (
          countCreatedBlocks !== this.maxNumberOfCarsPerPage
                        && data.indexOf(element)
                            >= this.garagePageNumber * this.maxNumberOfCarsPerPage - this.maxNumberOfCarsPerPage
        ) {
          const newCar = document.createElement('div') as HTMLElement;
          newCar.classList.add('garage-cars__car');
          newCar.id = `${element.id}`;
          carsFlex.append(newCar);
          const newCarButtonFlex = document.createElement('div') as HTMLElement;
          newCarButtonFlex.classList.add('buttons');
          newCar.append(newCarButtonFlex);
          const newCarbuttonSelect = document.createElement('div') as HTMLElement;
          newCarbuttonSelect.innerText = 'SELECT';
          newCarbuttonSelect.classList.add('button');
          newCarbuttonSelect.classList.add('button-select');
          newCarButtonFlex.append(newCarbuttonSelect);
          newCarbuttonSelect.addEventListener('click', (): void => {
            garageInputUpdateArea.removeAttribute('disabled');
            garageInputUpdateArea.focus();
            if (this.selectedButtonActive === true) {
              const buttons = document.querySelectorAll('.button-select');
              buttons.forEach((element): void => {
                element.classList.remove('inactive');
              });
              this.selectedButtonActive = false;
            }
            this.selectedCarId = element.id;
            newCarbuttonSelect.classList.add('inactive');
            this.selectedButtonActive = true;
          });
          const newCarbuttonRemove = document.createElement('div') as HTMLElement;
          newCarbuttonRemove.innerText = 'REMOVE';
          newCarbuttonRemove.classList.add('button');
          newCarbuttonRemove.addEventListener('click', (): void => {
            newCar.remove();
            deleteServerGarageCar(element.id).then((): void => {
              getCar();
            });
            getServerWinnersCar().then((data) => {
              data.forEach((winner) => {
                if (winner.id === element.id) {
                  deleteWinnersCar(element.id).then();
                }
              });
            });
          });
          newCarButtonFlex.append(newCarbuttonRemove);
          const newCarName = document.createElement('div') as HTMLElement;
          newCarName.classList.add('garage-cars__car-name');
          newCarButtonFlex.append(newCarName);
          newCarName.innerText = `${element.name}`;
          newCarName.setAttribute('id', `car${element.id}`);
          const newCarButtonsCarFlagFlex = document.createElement('div') as HTMLElement;
          newCarButtonsCarFlagFlex.classList.add('garage-cars__car-block');
          newCar.append(newCarButtonsCarFlagFlex);
          const newCarButtonFlexAB = document.createElement('div') as HTMLElement;
          newCarButtonFlexAB.classList.add('buttons');
          newCarButtonsCarFlagFlex.append(newCarButtonFlexAB);
          const newCarbuttonA = document.createElement('div') as HTMLElement;
          newCarbuttonA.innerText = 'Start';
          newCarbuttonA.classList.add('button');
          newCarbuttonA.classList.add('button-start');
          newCarButtonFlexAB.append(newCarbuttonA);
          const newCarbuttonB = document.createElement('div') as HTMLElement;
          newCarbuttonB.innerText = 'Stop';
          newCarbuttonB.classList.add('button');
          newCarbuttonB.classList.add('inactive');
          newCarbuttonB.classList.add('button-stop');
          newCarButtonFlexAB.append(newCarbuttonB);
          const newCarRoad = document.createElement('div') as HTMLElement;
          newCarRoad.classList.add('garage-cars__road');
          newCar.append(newCarRoad);
          const newCarImage = document.createElement('div') as HTMLElement;
          newCarImage.classList.add('garage-cars__car-image');
          newCarImage.innerHTML = carImage(`${element.color}`);
          newCarButtonsCarFlagFlex.append(newCarImage);
          const newCarFlag = document.createElement('div') as HTMLElement;
          newCarFlag.classList.add('garage-cars__flag');
          newCarFlag.innerHTML = flagImage();
          newCarButtonsCarFlagFlex.append(newCarFlag);
          const winnerResult = document.createElement('div') as HTMLElement;
          newCarImage.prepend(winnerResult);
          winnerResult.classList.add('garage-cars__winner-alert');
          countCreatedBlocks += 1;
          newCarbuttonA.addEventListener('click', (): void => {
            buttonReset.classList.remove('inactive');
            newCarbuttonA.classList.add('inactive');
            newCarbuttonB.classList.remove('inactive');
            startDrivingGarageCar(element.id);
            Garage.isRace = false;
          });
          newCarbuttonB.addEventListener('click', (): void => {
            newCarbuttonB.classList.add('inactive');
            newCarbuttonA.classList.remove('inactive');
            stopDrivingGarageCar(element.id);
            winnerResult.innerText = '';
          });
        }
      });
    });
    getCar();
  };
}
