import { StyleSheet, View } from 'react-native';
import Svg, { G, Text, TSpan } from 'react-native-svg';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';

import data from './map.json';

// AUTO-GENERATED IMPORTS for 5F - DO NOT EDIT
import Classroom_S51 from '../../../../assets/images/map/5F/classroom_S51.svg';
import Classroom_S52 from '../../../../assets/images/map/5F/classroom_S52.svg';
import Classroom_S53 from '../../../../assets/images/map/5F/classroom_S53.svg';
import Classroom_S54 from '../../../../assets/images/map/5F/classroom_S54.svg';
import Classroom_S55 from '../../../../assets/images/map/5F/classroom_S55.svg';
import Classroom_S56 from '../../../../assets/images/map/5F/classroom_S56.svg';
import Classroom_S57 from '../../../../assets/images/map/5F/classroom_S57.svg';
import Classroom_S58 from '../../../../assets/images/map/5F/classroom_S58.svg';
import Corridor from '../../../../assets/images/map/5F/corridor.svg';
import East_evacuation from '../../../../assets/images/map/5F/east_evacuation.svg';
import East_infoLounge from '../../../../assets/images/map/5F/east_infoLounge_S51.svg';
import East_locker from '../../../../assets/images/map/5F/east_locker_S51.svg';
import East_menToilet from '../../../../assets/images/map/5F/east_menToilet.svg';
import East_multipurposeToilet from '../../../../assets/images/map/5F/east_multipurposeToilet.svg';
import East_stairs from '../../../../assets/images/map/5F/east_stairs.svg';
import East_terrace from '../../../../assets/images/map/5F/east_terrace.svg';
import East_womenToilet from '../../../../assets/images/map/5F/east_womenToilet.svg';
import Elevator from '../../../../assets/images/map/5F/elevator.svg';
import Vending from '../../../../assets/images/map/5F/vending.svg';
import Wall_01 from '../../../../assets/images/map/5F/wall_01.svg';
import Wall_02 from '../../../../assets/images/map/5F/wall_02.svg';
import Wall_03 from '../../../../assets/images/map/5F/wall_03.svg';
import Wall_04 from '../../../../assets/images/map/5F/wall_04.svg';
import Wall_05 from '../../../../assets/images/map/5F/wall_05.svg';
import Wall_06 from '../../../../assets/images/map/5F/wall_06.svg';
import Wall_07 from '../../../../assets/images/map/5F/wall_07.svg';
import West_evacuation from '../../../../assets/images/map/5F/west_evacuation.svg';
import West_infoLounge from '../../../../assets/images/map/5F/west_infoLounge_S52.svg';
import West_locker from '../../../../assets/images/map/5F/west_locker_S52.svg';
import West_menToilet from '../../../../assets/images/map/5F/west_menToilet.svg';
import West_multipurposeToilet from '../../../../assets/images/map/5F/west_multipurposeToilet.svg';
import West_stairs from '../../../../assets/images/map/5F/west_stairs.svg';
import West_terrace from '../../../../assets/images/map/5F/west_terrace.svg';
import West_womenToilet from '../../../../assets/images/map/5F/west_womenToilet.svg';
const nameData = {
    classrooms: {
        "S51": data["5F"].classrooms.S51.name.split("_"),
        "S52": data["5F"].classrooms.S52.name.split("_"),
        "S53": data["5F"].classrooms.S53.name.split("_"),
        "S54": data["5F"].classrooms.S54.name.split("_"),
        "S55": data["5F"].classrooms.S55.name.split("_"),
        "S56": data["5F"].classrooms.S56.name.split("_"),
        "S57": data["5F"].classrooms.S57.name.split("_"),
        "S58": data["5F"].classrooms.S58.name.split("_"),
    },
    sections:{
        "east": {
            "locker": data["5F"].section.east.locker.name.split("_"),
            "infoLounge": data["5F"].section.east.infoLounge.name.split("_"),
            "terrace": data["5F"].section.east.terrace.name.split("_")
        },
        "west": {
            "locker": data["5F"].section.west.locker.name.split("_"),
            "infoLounge": data["5F"].section.west.infoLounge.name.split("_"),
            "terrace": data["5F"].section.west.terrace.name.split("_")
        },
    } 
}


export default function Floor5() {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const isZoomed = useSharedValue(false);
    console.log(isZoomed);

    const pinch = Gesture.Pinch().onUpdate((e) => {
        scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
        savedScale.value = scale.value;
    });

    const doubleTap = Gesture.Tap().numberOfTaps(2).onStart(() => {
        if (!isZoomed.value) {
            scale.value = savedScale.value = 1.5;
            isZoomed.value = true;
        } else {
            scale.value = savedScale.value = 1;
            isZoomed.value = false;
        }
    })
    .onEnd(() => {
        savedScale.value = scale.value;
    });

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const drag = Gesture.Pan().onChange((Event) =>  {
        translateX.value += Event.changeX;
        translateY.value += Event.changeY;
    });

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: scale.value
                },
                {
                    translateX: translateX.value
                },
                {
                    translateY: translateY.value
                },
            ],
        };
    });

    const combined = Gesture.Simultaneous(pinch, drag, doubleTap);

    return(
        <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={combined}>
                <Animated.View style={[containerStyle, { top: -280 }]}>
                    <Svg width="644" height="1536" viewBox="-161 -161 512 512">
                        <G transform="translate(0, 0)">
                            <G transform="translate(0, -63)">
                                <Classroom_S51 width="59" height="64" fill={roomColors.classroom}/>
                                <Text
                                    x={ 59 / 2 }
                                    y={ 64 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={59 / 2} dy="-0.5em">{nameData.classrooms.S51[0]}</TSpan>
                                    <TSpan x={59 / 2} dy="1.2em">{nameData.classrooms.S51[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(0, -127)">
                                <Classroom_S52 width="59" height="64" fill={roomColors.classroom}/>
                                <Text
                                    x={ 59 / 2 }
                                    y={ 64 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={59 / 2} dy="-0.5em">{nameData.classrooms.S52[0]}</TSpan>
                                    <TSpan x={59 / 2} dy="1.2em">{nameData.classrooms.S52[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(0, -191)">
                                <Classroom_S53 width="59" height="64" fill={roomColors.classroom}/>
                                <Text
                                    x={ 59 / 2 }
                                    y={ 64 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={59 / 2} dy="-0.5em">{nameData.classrooms.S53[0]}</TSpan>
                                    <TSpan x={59 / 2} dy="1.2em">{nameData.classrooms.S53[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(0, -255)">
                                <Classroom_S54 width="59" height="64" fill={roomColors.classroom}/>
                                <Text
                                    x={ 59 / 2 }
                                    y={ 64 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={59 / 2} dy="-0.5em">{nameData.classrooms.S54[0]}</TSpan>
                                    <TSpan x={59 / 2} dy="1.2em">{nameData.classrooms.S54[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(0, -319)">
                                <Classroom_S55 width="59" height="64" fill={roomColors.classroom}/>
                                <Text
                                    x={ 59 / 2 }
                                    y={ 64 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={59 / 2} dy="-0.5em">{nameData.classrooms.S55[0]}</TSpan>
                                    <TSpan x={59 / 2} dy="1.2em">{nameData.classrooms.S55[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(0, -383)">
                                <Classroom_S56 width="59" height="64" fill={roomColors.classroom}/>
                                <Text
                                    x={ 59 / 2 }
                                    y={ 64 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={59 / 2} dy="-0.5em">{nameData.classrooms.S56[0]}</TSpan>
                                    <TSpan x={59 / 2} dy="1.2em">{nameData.classrooms.S56[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(0, -447)">
                                <Classroom_S57 width="59" height="64" fill={roomColors.classroom}/>
                                <Text
                                    x={ 59 / 2 }
                                    y={ 64 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={59 / 2} dy="-0.5em">{nameData.classrooms.S57[0]}</TSpan>
                                    <TSpan x={59 / 2} dy="1.2em">{nameData.classrooms.S57[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(0, -511)">
                                <Classroom_S58 width="59" height="64" fill={roomColors.classroom}/>
                                <Text
                                    x={ 59 / 2 }
                                    y={ 64 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={59 / 2} dy="-0.5em">{nameData.classrooms.S58[0]}</TSpan>
                                    <TSpan x={59 / 2} dy="1.2em">{nameData.classrooms.S58[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(59, -494)">
                                <Corridor fill={roomColors.others}/>
                            </G>
                            <G transform="translate(59, -15)">
                                <East_evacuation fill={roomColors.evacuation}/>
                            </G>
                            <G transform="translate(79, -32.5)">
                                <East_menToilet fill={roomColors.others}/>
                            </G>
                            <G transform="translate(111.5, -70)">
                                <East_womenToilet fill={roomColors.others}/>
                            </G>
                            <G transform="translate(89, -55)">
                                <East_multipurposeToilet fill={roomColors.others}/>
                            </G>
                            <G transform="translate(93, -81)">
                                <Elevator fill={roomColors.others}/>
                            </G>
                            <G transform="translate(79, -111)">
                                <East_stairs fill={roomColors.others}/>
                            </G>
                            <G transform="translate(79, -147)">
                                <East_locker width="82" height="28" fill={roomColors.others}/>
                                <Text
                                    x={ 82 / 2 }
                                    y={ 28 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={82 / 2} dy="-0.5em">{nameData.sections.east.locker[0]}</TSpan>
                                    <TSpan x={82 / 2} dy="1.2em">{nameData.sections.east.locker[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(79, -175)">
                                <East_infoLounge width="82" height="28" fill={roomColors.others}/>
                                <Text
                                    x={ 82 / 2 }
                                    y={ 28 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={82 / 2} dy="-0.5em">{nameData.sections.east.infoLounge[0]}</TSpan>
                                    <TSpan x={82 / 2} dy="1.2em">{nameData.sections.east.infoLounge[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(93, -206)">
                                <East_terrace width="68" height="31" fill={roomColors.terrace}/>
                                <Text
                                    x={ 68 / 2 }
                                    y={ 31 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={68 / 2} dy="-0.5em">{nameData.sections.east.terrace[0]}</TSpan>
                                    <TSpan x={68 / 2} dy="1.2em">{nameData.sections.east.terrace[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(59, -511)">
                                <West_evacuation fill={roomColors.evacuation}/>
                            </G>
                            <G transform="translate(79, -511)">
                                <West_menToilet fill={roomColors.others}/>
                            </G>
                            <G transform="translate(111.5, -478)">
                                <West_womenToilet fill={roomColors.others}/>
                            </G>
                            <G transform="translate(89, -478)">
                                <West_multipurposeToilet fill={roomColors.others}/>
                            </G>
                            <G transform="translate(79, -455)">
                                <Vending fill={roomColors.others}/>
                            </G>
                            <G transform="translate(79, -429)">
                                <West_stairs fill={roomColors.others}/>
                            </G>
                            <G transform="translate(79, -393)">
                                <West_locker width="82" height="28" fill={roomColors.others}/>
                                <Text
                                    x={ 82 / 2 }
                                    y={ 28 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={82 / 2} dy="-0.5em">{nameData.sections.west.locker[0]}</TSpan>
                                    <TSpan x={82 / 2} dy="1.2em">{nameData.sections.west.locker[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(79, -366)">
                                <West_infoLounge width="82" height="28" fill={roomColors.others}/>
                                <Text
                                    x={ 82 / 2 }
                                    y={ 28 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={82 / 2} dy="-0.5em">{nameData.sections.west.infoLounge[0]}</TSpan>
                                    <TSpan x={82 / 2} dy="1.2em">{nameData.sections.west.infoLounge[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(93, -339)">
                                <West_terrace width="68" height="31" fill={roomColors.terrace}/>
                                <Text
                                    x={ 68 / 2 }
                                    y={ 31 / 2 }
                                    fontSize={roomText.fontsize}
                                    fill={roomText.color}
                                    textAnchor='middle'
                                    alignmentBaseline='middle'
                                >
                                    <TSpan x={68 / 2} dy="-0.5em">{nameData.sections.west.terrace[0]}</TSpan>
                                    <TSpan x={68 / 2} dy="1.2em">{nameData.sections.west.terrace[1]}</TSpan>
                                </Text>
                            </G>
                            <G transform="translate(79, -55.25)">
                                <Wall_01 fill={roomColors.wall}/>
                            </G>
                            <G transform="translate(118.5, -81)">
                                <Wall_02 fill={roomColors.wall}/>
                            </G>
                            <G transform="translate(79, -81)">
                                <Wall_03 fill={roomColors.wall}/>
                            </G>
                            <G transform="translate(79, -119)">
                                <Wall_04 fill={roomColors.wall}/>
                            </G>
                            <G transform="translate(79, -399)">
                                <Wall_05 fill={roomColors.wall}/>
                            </G>
                            <G transform="translate(124, -440)">
                                <Wall_06 fill={roomColors.wall}/>
                            </G>
                            <G transform="translate(79.18, -478.23)">
                                <Wall_07 fill={roomColors.wall}/>
                            </G>
                        </G>
                    </Svg>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const roomColors = {
    classroom: '#FDB899',
    evacuation: 'white',
    terrace: 'white',
    wall: '#FDE3B8',
    others: '#D9D9D9'
};

const roomText = {
    color: 'black',
    fontsize: '8'
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textWrapper: {
        color: 'black',
    },
    classroom: {
        color: 'black'
    },
});