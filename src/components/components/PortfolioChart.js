import React, { Component, Suspense } from "react";
// import Chart from "react-apexcharts";
import { withStyles } from "@material-ui/core/styles";

import { colors } from "../../theme";
import { CircularProgress, Card } from "@material-ui/core";
import {
  DB_GET_PORTFOLIO_CHART,
  DB_GET_PORTFOLIO_CHART_RETURNED,
  DARKMODE_SWITCH_RETURN,
  SWITCH_VS_COIN_RETURNED,
} from "../../constants";

import Store from "../../stores";
const emitter = Store.emitter;
const dispatcher = Store.dispatcher;
const store = Store.store;

const Chart = React.lazy(() => import("react-apexcharts"));

const styles = (theme) => ({
  root: {
    marginTop: 10,
    display: "flexGrow",
    minHeight: "300px",
    marginBottom: 20,
  },
});

class PortfolioChart extends Component {
  constructor(props) {
    super(props);

    let color = [colors.cgGreen];

    const tema = store.getStore("theme");
    console.log(props.data);

    this.state = {
      options: {
        theme: {
          mode: tema,
        },
        stroke: {
          width: 2,
          curve: "straight",
        },

        colors: color,
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.8,
            opacityTo: 0.3,
          },
        },
        chart: {
          animations: {
            enabled: false,
          },
          id: "",
          background: "rgba(0, 0, 0, 0.0)",
        },
        xaxis: {
          type: "datetime",
          tickAmount: 1,
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          crosshairs: {
            show: true,
            position: "back",
            stroke: {
              color: colors.cgOrange,
              width: 2,
              dashArray: 1,
            },
          },
          tooltip: {
            enabled: true,
          },

          type: "numeric",
          decimalsInFloat: 4,
          forceNiceScale: true,
        },
      },
      series: [
        {
          name: "",
          data: props.data,
        },
      ],
    };
  }

  componentDidMount() {
    emitter.on(DARKMODE_SWITCH_RETURN, this.darkModeSwitchReturned);
    emitter.on(SWITCH_VS_COIN_RETURNED, this.vsCoinReturned);
    emitter.on(DB_GET_PORTFOLIO_CHART_RETURNED, this.portfolioChartReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(DARKMODE_SWITCH_RETURN, this.darkModeSwitchReturned);
    emitter.removeListener(SWITCH_VS_COIN_RETURNED, this.vsCoinReturned);
    emitter.removeListener(
      DB_GET_PORTFOLIO_CHART_RETURNED,
      this.portfolioChartReturned
    );
  }

  darkModeSwitchReturned = (theme) => {
    let colorMode = theme ? "dark" : "light";
    this.setState({
      options: {
        ...this.state.options,
        theme: {
          mode: colorMode,
        },
      },
    });
  };

  vsCoinReturned = (vsCoin) => {
    // dispatcher.dispatch({
    //   type: DB_GET_PORTFOLIO_CHART,
    //   content: [this.props.coinID, this.props.id, this.props.timeFrame, vsCoin],
    // });
  };

  portfolioChartReturned = (data) => {
    console.log("CHART DATAAAAA");
    console.log(data);
    // this.setState({
    //   series: [
    //     {
    //       name: "",
    //       data: data,
    //     },
    //   ],
    // });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {
          <Chart
            options={this.state.options}
            series={this.state.series}
            type="area"
            width="100%"
            height="100%"
          />
        }
      </div>
    );
  }
}

export default withStyles(styles)(PortfolioChart);
