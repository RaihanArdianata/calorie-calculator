import { IngredientTypes } from "../types/db-schema/ingeredients";
import * as _ from 'lodash';

interface DataType {
  ingredient: IngredientTypes;
}

export const totalCalorie = ({ data }: { data: DataType[]; }) => {
  let calorieTotal = 0;

  if (_.isArray(data)) {
    _.forEach(data, ({ ingredient }) => {

      if (!_.isEmpty(ingredient)) {
        calorieTotal += ingredient?.calories || 0;
      }
    });
  }

  return calorieTotal;
};

export const totalPortions = ((numOfIngredients: number) => {
  const DEFAULT_WIGHT = 100;
  const DEFAULT_PORTION_WEIGHT = 250;

  const result = (numOfIngredients * DEFAULT_WIGHT) / DEFAULT_PORTION_WEIGHT;

  return Math.round(result) >= 1 ? Math.round(result) : 1;
});