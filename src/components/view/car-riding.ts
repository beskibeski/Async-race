import {
  getServerWinnersCar,
  putWinnerCars,
  startEngineGarageCar,
  stopEngineGarageCar,
  stopGarageCarIfEngineBroken,
  updateWinnerCars,
} from '../api/api';
import Garage from './garage';

let hasWinner = false;
let isAnimated = true;
let hasUpdated = false;
const carStartPosition = 0;

export const makeRaceButtonActive = (): void => {
  const raceButton = document.querySelector('.button-race') as HTMLElement;
  raceButton.classList.remove('inactive');
};

export const makeResetButtonInActive = (): void => {
  const resetButton = document.querySelector('.button-reset') as HTMLElement;
  resetButton.classList.add('inactive');
};

export const startAnimation = (
  carBlock: HTMLElement,
  serverVelocity: number,
  serverDistance: number,
  elementId: number,
): void => {
  const flag = carBlock.nextElementSibling as HTMLElement;
  isAnimated = true;
  const distance = document.body.clientWidth - (carBlock.offsetWidth + 30);
  const carTime = serverDistance / (serverVelocity * 500) / Math.log(document.body.clientWidth * 50);
  let carPosition = 0;
  let frame = 0;
  let isBrokenEngine = false;
  stopGarageCarIfEngineBroken(elementId).then((data) => {
    if (data.status === 500) {
      isBrokenEngine = true;
    }
  });
  const step = (timestamp: number): void => {
    carBlock.style.transform = `translateX(${carPosition}px)`;
    carPosition += carTime;
    if (isAnimated === false) {
      cancelAnimationFrame(timestamp);
      carBlock.style.transform = `translateX(${carPosition}px)`;
    }
    if (carPosition < distance && isAnimated === true && isBrokenEngine === false) {
      requestAnimationFrame(step);
      frame += 1;
    }
    if (carPosition >= flag.offsetWidth) {
      if (!hasWinner && Garage.isRace) {
        hasWinner = true;
        hasUpdated = false;
        const winnerId = Number(carBlock.parentElement?.parentElement?.id);
        const winnerCarName = carBlock.parentElement?.parentElement?.querySelector(
          '.garage-cars__car-name',
        ) as HTMLElement;
        const winnerResult = carBlock.querySelector('.garage-cars__winner-alert') as HTMLElement;
        const carTime = (frame / 60).toFixed(2);
        winnerResult.innerText = `${winnerCarName.innerText} WINS!!!\n${carTime.toString()} seconds`;
        getServerWinnersCar().then((data): void => {
          data.forEach((element): void => {
            if (element.id === winnerId) {
              if (element.wins <= +carTime) {
                updateWinnerCars({
                  id: winnerId,
                  wins: (element.wins += 1),
                  time: element.wins,
                }).then();
              } else {
                updateWinnerCars({ id: winnerId, wins: (element.wins += 1), time: +carTime }).then();
              }
              hasUpdated = true;
              cancelAnimationFrame(timestamp);
            }
          });
          if (!hasUpdated) {
            putWinnerCars({ id: winnerId, wins: 1, time: +carTime }).then();
            cancelAnimationFrame(timestamp);
          }
        });
      }
    }
  };
  requestAnimationFrame(step);
};

export const changeButtonsStateForRacing = (): void => {
  const startButtons = document.querySelectorAll('.button-start');
  const stopButtons = document.querySelectorAll('.button-stop');
  startButtons.forEach((element) => {
    element.classList.add('inactive');
  });
  stopButtons.forEach((element) => {
    element.classList.remove('inactive');
  });
  makeRaceButtonActive();
};

export const changeButtonsStateForStopping = (): void => {
  const stopButtons = document.querySelectorAll('.button-stop');
  stopButtons.forEach((element) => {
    element.classList.add('inactive');
  });
  const startButtons = document.querySelectorAll('.button-start');
  startButtons.forEach((element) => {
    element.classList.remove('inactive');
  });
};

export const resetAllCars = (): void => {
  isAnimated = false;
  changeButtonsStateForStopping();
  const winnerResult = document.querySelectorAll('.garage-cars__winner-alert');
  winnerResult.forEach((element): void => {
    stopEngineGarageCar(Number(element.parentElement?.parentElement?.parentElement?.id)).then();
  });
};

export const winnerCarsResultToNull = (): void => {
  hasWinner = false;
  const winnerResult = document.querySelectorAll('.garage-cars__winner-alert');
  winnerResult.forEach((element): void => {
    element.innerText = '';
  });
};

export const startDrivingGarageCar = async (elementId: number) => {
  startEngineGarageCar(elementId).then((carValues) => {
    const carImage = document.getElementById(`${elementId}`)?.children[1].children[1] as HTMLElement;
    startAnimation(carImage, carValues.velocity, carValues.distance, elementId);
  });
};

export const stopDrivingGarageCar = async (elementId: number) => {
  stopEngineGarageCar(elementId).then(() => {
    isAnimated = false;
    const carImage = document.getElementById(`${elementId}`)?.children[1].children[1] as HTMLElement;
    carImage.style.transform = `translateX(${carStartPosition}px)`;
  });
};
