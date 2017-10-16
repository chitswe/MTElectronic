import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideWidth = wp(90);
const itemHorizontalMargin = 0;

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth ;//+ itemHorizontalMargin * 2;

const entryBorderRadius = 8;

const styles = StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: itemWidth
    },
    imageContainer: {
        height:itemWidth,
        backgroundColor: 'white',
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain'
    }
});
export default class SliderEntry extends Component {

    static propTypes = {
        url: PropTypes.string.isRequired,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image () {
        const { url, parallax, parallaxProps } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: url }}
              containerStyle={styles.imageContainer}
              style={styles.image}
              parallaxFactor={0}
              showSpinner={true}
              spinnerColor='rgba(0, 0, 0, 0.25)'
              resizeMode="contain"
              parallaxFactor={0}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: url }}
              style={styles.image}
            />
        );
    }

    render () {
        const { url } = this.props;



        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => { alert(`You've clicked '${url}'`); }}
              >
                <View style={styles.imageContainer}>
                    { this.image }
                </View>
            </TouchableOpacity>
        );
    }
}
