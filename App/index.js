import React from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';

import Row from './components/Row'
import Button from './components/Button'
import calculator, { initialState } from './util/Calculator'
import { addListener, removeListener } from './util/sensors'

import { Audio } from 'expo-av';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#202020',
        justifyContent: "flex-end"
    },
    value: {
        color: '#fff',
        fontSize: 40,
        textAlign: "right",
        marginRight: 20,
        marginBottom: 10
    },
});

export default class App extends React.Component {
    state = initialState;

    playbackInstance = null;
    source = require('./sounds/Tap.wav');

    async componentDidMount() {
        addListener(() => {
          this.handleTap('clear');
        });
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
        });
    }

    async _loadNewPlaybackInstance(playing) {
        if (this.playbackInstance != null) {
            await this.playbackInstance.unloadAsync();
            this.playbackInstance.setOnPlaybackStatusUpdate(null);
            this.playbackInstance = null;
        }
        const initialStatus = {
            shouldPlay: false,
            rate: 1.0,
            shouldCorrectPitch: true,
            volume: 1.0,
            isMuted: false
        };
        const { sound, status } = await Audio.Sound.createAsync(
            this.source,
            initialStatus
        );

        this.playbackInstance = sound;
        this.playbackInstance.setIsLoopingAsync(false);
        this.playbackInstance.playAsync();
    }

    componentWillUnmount() {
        removeListener();
    }

    handleTap = (type, value) => {
        this._loadNewPlaybackInstance(true);
        this.setState(state => calculator(type, value, state));
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SafeAreaView>
                    <Text style={styles.value}>
                        {parseFloat(this.state.currentValue).toString().toLocaleString()}
                    </Text>
                    <Row>
                        <Button text="C" theme="secondary" onPress={() => this.handleTap("clear")} />
                        <Button text="+/-" theme="secondary" onPress={() => this.handleTap("posneg")} />
                        <Button text="%" theme="secondary" onPress={() => this.handleTap("percentage")} />
                        <Button text="/" theme="accent" onPress={() => this.handleTap("operator", "/")} />
                    </Row>
                    <Row>
                        <Button text="7" onPress={() => this.handleTap("number", 7)} />
                        <Button text="8" onPress={() => this.handleTap("number", 8)} />
                        <Button text="9" onPress={() => this.handleTap("number", 9)} />
                        <Button text="x" theme="accent" onPress={() => this.handleTap("operator", "*")} />
                    </Row>
                    <Row>
                        <Button text="4" onPress={() => this.handleTap("number", 4)} />
                        <Button text="5" onPress={() => this.handleTap("number", 5)} />
                        <Button text="6" onPress={() => this.handleTap("number", 6)} />
                        <Button text="-" theme="accent" onPress={() => this.handleTap("operator", "-")} />
                    </Row>
                    <Row>
                        <Button text="1" onPress={() => this.handleTap("number", 1)} />
                        <Button text="2" onPress={() => this.handleTap("number", 2)} />
                        <Button text="3" onPress={() => this.handleTap("number", 3)} />
                        <Button text="+" theme="accent" onPress={() => this.handleTap("operator", "+")} />
                    </Row>
                    <Row>
                        <Button text="0" size="double" onPress={() => this.handleTap("number", 0)} />
                        <Button text="." onPress={() => this.handleTap("number", ".")} />
                        <Button text="=" theme="accent" onPress={() => this.handleTap("equal")} />
                    </Row>
                </SafeAreaView>
            </View>
        );
    }
}
