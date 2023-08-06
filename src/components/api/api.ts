import {
  TCars, TWinners, TCar, IWinner,
} from '../types/types';
import { EngineStatus } from '../types/enums';

export const serverUrl = 'http://127.0.0.1:3000';
export const serverGarage = `${serverUrl}/garage`;
export const serverWinners = `${serverUrl}/winners`;
export const serverEngine = `${serverUrl}/engine`;

export const getServerGarageCar = async () => {
  const url = await fetch(serverGarage);
  const data: TCars = await url.json();
  return data;
};

export const getServerWinnersCar = async () => {
  const url = await fetch(serverWinners);
  const data: TWinners = await url.json();
  return data;
};

export const putServerGarageCar = async (car: TCar) => {
  await fetch(serverGarage, {
    method: 'POST',
    body: JSON.stringify(car),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteServerGarageCar = async (id: number) => {
  await fetch(`${serverGarage}/${id}`, {
    method: 'DELETE',
  });
};

export const updateServerGarageCar = async (id: number, car: TCar) => {
  await fetch(`${serverGarage}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(car),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteWinnersCar = async (id: number) => {
  await fetch(`${serverWinners}/${id}`, {
    method: 'DELETE',
  });
};

export const putWinnerCars = async (car: IWinner) => {
  await fetch(`${serverWinners}`, {
    method: 'POST',
    body: JSON.stringify(car),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateWinnerCars = async (car: IWinner) => {
  await fetch(`${serverWinners}/${car.id}`, {
    method: 'PATCH',
    body: JSON.stringify(car),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const startEngineGarageCar = async (id: number) => {
  const url = await fetch(`${serverEngine}?id=${id}&status=${EngineStatus.engineStarted}`, {
    method: 'PATCH',
  });
  return url.json();
};

export const stopEngineGarageCar = async (id: number) => {
  const url = await fetch(`${serverEngine}?id=${id}&status=${EngineStatus.engineStopped}`, {
    method: 'PATCH',
  });
  return url.json();
};

export const stopGarageCarIfEngineBroken = async (id: number) => fetch(`${serverEngine}?id=${id}&status=${EngineStatus.engineDrive}`, {
  method: 'PATCH',
});
