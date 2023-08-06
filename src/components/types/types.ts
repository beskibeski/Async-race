import { Sorting } from './enums';

export interface ICar {
  name: string;
  color: string;
  id: number;
}

export type TCars = ICar[];

export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export type TWinners = IWinner[];

export type TCar = {
  name: string;
  color: string;
};

export type TSorting = Sorting;
