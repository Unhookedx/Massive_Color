import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Palette from "./components/Palette";
import seedColors from "./components/seedColors";
import { generatePalette } from "./components/colorHelpers";
import PaletteList from "./components/PaletteList";
import SingleColorPalette from "./components/SingleColorPalette";
import NewPaletteForm from "./components/NewPaletteForm";

const savedPalettes = JSON.parse(window.localStorage.getItem("palettes"));

class App extends React.Component {
  state = { palettes: savedPalettes || seedColors };

  findPalette = (id) => {
    return this.state.palettes.find((palette) => {
      return palette.id === id;
    });
  };

  savePalette = (newPalette) => {
    this.setState(
      { palettes: [...this.state.palettes, newPalette] },
      this.syncLocalStorage
    );
  };

  deletePalette = (id) => {
    this.setState(
      (st) => ({
        palettes: st.palettes.filter((palette) => palette.id !== id),
      }),
      this.syncLocalStorage
    );
  };

  syncLocalStorage = () => {
    window.localStorage.setItem(
      "palettes",
      JSON.stringify(this.state.palettes)
    );
  };
  
  render() {
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/palette/new"
            render={(routeProps) => (
              <NewPaletteForm
                savePalette={this.savePalette}
                palettes={this.state.palettes}  
                {...routeProps}
              />
            )}
          />
          <Route
            exact
            path="/"
            render={(routeProps) => (
              <PaletteList palettes={this.state.palettes} deletePalette={this.deletePalette} {...routeProps} />
            )}
          />
          <Route
            exact
            path="/palette/:id"
            render={(routeProps) => (
              <Palette
                palette={generatePalette(
                  this.findPalette(routeProps.match.params.id)
                )}
              />
            )}
          />
          <Route
            exact
            path="/palette/:paletteId/:colorId"
            render={(routeProps) => (
              <SingleColorPalette
                colorId={routeProps.match.params.colorId}
                palette={generatePalette(
                  this.findPalette(routeProps.match.params.paletteId)
                )}
              />
            )}
          />
        </Switch>
        {/* <div>
      <Palette palette={generatePalette(seedColors[4])} />
    </div> */}
      </div>
    );
  }
}

export default App;
