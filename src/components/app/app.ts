import Garage from '../view/garage';
import Winners from '../view/winners';
import ViewButtons from '../view/viewButtons';

export default class App {
  private viewButtons: ViewButtons;

  private garage: Garage;

  private winners: Winners;

  constructor() {
    this.viewButtons = new ViewButtons();
    this.garage = new Garage();
    this.winners = new Winners();
  }

  private reCreateWinners = (): void => {
    const winnersFlex = document.querySelector('.winners');
    winnersFlex?.remove();
    this.winners.create();
  };

  public start = (): void => {
    this.viewButtons.create();
    this.garage.create();
    this.winners.create();
    const buttonWinners = document.querySelector('.button-winners') as HTMLElement;
    buttonWinners.addEventListener('click', (): void => {
      this.reCreateWinners();
      const winners = document.querySelector('.winners') as HTMLElement;
      const garage = document.querySelector('.garage') as HTMLElement;
      const buttonGarage = document.querySelector('.button-garage') as HTMLElement;
      winners.classList.add('active');
      buttonGarage.classList.remove('inactive');
      buttonWinners.classList.add('inactive');
      if (garage.classList.contains('active')) {
        garage.classList.remove('active');
      }
    });
  };
}
