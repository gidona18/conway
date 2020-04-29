/* tslint:disable */
/* eslint-disable */
export class Universe {
  free(): void;
/**
* @param {number} width 
* @param {number} height 
* @returns {Universe} 
*/
  static new(width: number, height: number): Universe;
/**
* @returns {number} 
*/
  width(): number;
/**
* @returns {number} 
*/
  height(): number;
/**
* @returns {number} 
*/
  cells(): number;
/**
*/
  tick(): void;
}
