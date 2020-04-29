//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

extern crate conway;
use conway::Universe;


#[cfg(test)]
pub fn input_spaceship() -> Universe {
    let mut universe = Universe::new(6,6);
    universe.set_cells(&[(1,2), (2,3), (3,1), (3,2), (3,3)]);
    universe
}

#[cfg(test)]
pub fn expected_spaceship() -> Universe {
    let mut universe = Universe::new(6,6);
    universe.set_cells(&[(2,1), (2,3), (3,2), (3,3), (4,2)]);
    universe
}

#[wasm_bindgen_test]
pub fn test_tick() {
    // create a universe with a spaceship in it
    let mut input_universe = input_spaceship();
    // this universe is what the previous would look like after a tick
    let expected_universe = expected_spaceship();
    // tick the world and see if the result is what we expected
    input_universe.tick();
    assert_eq!(&input_universe.get_cells(), &expected_universe.get_cells());
}