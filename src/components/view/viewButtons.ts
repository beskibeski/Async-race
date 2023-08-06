export default class Viewbuttons {
  public static create = (): void => {
    const body = document.querySelector('.body') as HTMLElement;
    const buttonsFlex = document.createElement('div') as HTMLElement;
    buttonsFlex.classList.add('buttons');
    body.append(buttonsFlex);
    const buttonGarage = document.createElement('div') as HTMLElement;
    buttonGarage.innerText = 'TO GARAGE';
    buttonGarage.classList.add('button');
    buttonGarage.classList.add('button-garage');
    buttonGarage.classList.add('inactive');
    buttonsFlex.append(buttonGarage);
    const buttonWinners = document.createElement('div') as HTMLElement;
    buttonWinners.innerText = 'TO WINNERS';
    buttonWinners.classList.add('button');
    buttonWinners.classList.add('button-winners');
    buttonsFlex.append(buttonWinners);
    buttonGarage.addEventListener('click', (): void => {
      const garage = document.querySelector('.garage') as HTMLElement;
      const winners = document.querySelector('.winners') as HTMLElement;
      garage.classList.add('active');
      buttonGarage.classList.add('inactive');
      buttonWinners.classList.add('button');
      buttonWinners.classList.remove('inactive');
      if (winners.classList.contains('active')) {
        winners.classList.remove('active');
      }
    });
  };
}
