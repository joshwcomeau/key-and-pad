import { createSelector } from 'reselect';


const casettesSelector = state => state.vcrPlayer.casettes;
const casettePageNumberSelector = state => state.vcrPlayer.casettePageNumber;
const casettePageLimitSelector = state => state.vcrPlayer.casettePageLimit;

export const casetteListSelector = createSelector(
  casettesSelector,
  (casettes) => {
    const casetteIds = Object.keys(casettes);

    return casetteIds
      .map(id => ({ id, ...casettes[id] }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }
);

export const paginatedCasetteListSelector = createSelector(
  casetteListSelector,
  casettePageNumberSelector,
  casettePageLimitSelector,
  (casetteList, pageNumber, pageLimit) => {
    const startIndex = pageNumber * pageLimit;
    const endIndex = startIndex + pageLimit;

    return casetteList.slice(startIndex, endIndex);
  }
);

export const isFirstPageSelector = createSelector(
  casettePageNumberSelector,
  (pageNumber) => pageNumber === 0
);

export const isLastPageSelector = createSelector(
  casetteListSelector,
  casettePageNumberSelector,
  casettePageLimitSelector,
  (casetteList, pageNumber, pageLimit) => {
    const numOfCasettes = casetteList.length;
    const numOfPages = Math.floor(numOfCasettes / pageLimit);

    return pageNumber >= numOfPages;
  }
);
