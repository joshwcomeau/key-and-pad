import { createSelector } from 'reselect';


const casettesSelector = state => state.vcrPlayer.casettes;
const casettePageNumberSelector = state => state.vcrPlayer.casettePageNumber;
const casettePageLimitSelector = state => state.vcrPlayer.casettePageLimit;

export const casetteListSelector = createSelector(
  casettesSelector,
  (casettes) => {
    const casetteIds = Object.keys(casettes);

    return casetteIds.map(id => ({ id, ...casettes[id] }));
  }
);

export const paginatedCasetteListSelector = createSelector(
  casetteListSelector,
  casettePageNumberSelector,
  casettePageLimitSelector,
  (casettes, pageNumber, pageLimit) => {
    return casettes.slice(pageNumber * pageLimit, pageLimit);
  }
);
