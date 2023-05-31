import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChart = ({ data, bottom, left, minVal, maxVal }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[300],
            },
          },
          legend: {
            text: {
              fill: colors.grey[300],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[300],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[300],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[300],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={{ scheme: "nivo" }} // added
      margin={{ top: 50, right: 250, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: minVal ? minVal : "auto",
        max: maxVal ? maxVal :"auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: bottom, // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: left, // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={true}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}  
    />
  );
};

export default LineChart;
