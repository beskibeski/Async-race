export const pagination = (
  carsCount: number,
  page: number,
  maxCarsPerPage: number,
  buttonPrev: HTMLElement,
  buttonNext: HTMLElement,
): void => {
  if (carsCount > page * maxCarsPerPage) {
    buttonNext.classList.remove('inactive');
  }
  if (carsCount <= page * maxCarsPerPage) {
    buttonNext.classList.add('inactive');
  }
  if (page === 1) {
    buttonPrev.classList.add('inactive');
  }
  if (page > 1) {
    buttonPrev.classList.remove('inactive');
  }
};

export const previousPage = (page: number, buttonPrev: HTMLElement, elementForPage: HTMLElement): void => {
  page -= 1;
  elementForPage.innerText = `Page #${page}`;
  if (page === 1) {
    buttonPrev.classList.add('inactive');
  }
};

export const nextPage = (
  page: number,
  buttonNext: HTMLElement,
  elementForPage: HTMLElement,
  carsCount: number,
  maxCarsPerPage: number,
): void => {
  page += 1;
  elementForPage.innerText = `Page #${page}`;
  if (carsCount < page * maxCarsPerPage) {
    buttonNext.classList.add('inactive');
  }
};
