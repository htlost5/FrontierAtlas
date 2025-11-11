// import React from "react";
// import { StyleSheet, Text, View } from "react-native";

// import {
//   FillLayer,
//   LineLayer,
//   ShapeSource,
// } from "@maplibre/maplibre-react-native";

// import useLoadGeoJson from "@/hooks/useLoadGeoJson";

// import floor1 from "@/assets/imdf/studyhall/sections/floor1.geojson";
// import floor2 from "@/assets/imdf/studyhall/sections/floor2.geojson";
// import floor3 from "@/assets/imdf/studyhall/sections/floor3.geojson";
// import floor4 from "@/assets/imdf/studyhall/sections/floor4.geojson";
// import floor5 from "@/assets/imdf/studyhall/sections/floor5.geojson";

// const sectionFiles: Record<number, any> = {
//   1: floor1,
//   2: floor2,
//   3: floor3,
//   4: floor4,
//   5: floor5,
// };

// type Props = {
//   floor_num: number;
// };

// export default function FloorN_section({ floor_num }: Props) {
//   const dataSet = sectionFiles[floor_num];

//   const { geoJsonList, loading, error } = useLoadGeoJson(dataSet);

//   if (error) {
//     console.error(error);
//     return (
//       <View style={styles.screen}>
//         <Text>loading error</Text>
//         <Text>please restart this app</Text>
//       </View>
//     );
//   }

//   if (loading || !geoJsonList) {
//     return null;
//   }

//   return (
//     <ShapeSource id="section-source" shape={geoJsonList[0]}>
//       <FillLayer
//         id="section-fill"
//         style={{
//           fillColor: "#FFF5D9",
//         }}
//       />
//       <LineLayer
//         id="section-line"
//         style={{
//           lineColor: "#F0DFAF",
//           lineWidth: 1,
//         }}
//       />
//     </ShapeSource>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//   },
// });
