import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  FlatList,
  ViewPropTypes,
  StyleSheet,
  Dimensions,
  Animated,
  ListRenderItem,
  StyleProp,
  ViewStyle,
  ScaledSize,
  ListRenderItemInfo
} from "react-native"

// Metrics constansts
const CARD_WIDTH = 200

export interface HorizontalCarouselProps<Item> {
  data: Array<unknown>
  renderItem: ListRenderItem<Item>
  keyExtractor: (item: Item, index: number) => string
  style: StyleProp<ViewStyle>
}

interface HorizontalCarouselState {
  width: number
  scrollAnimation: Animated.Value
}

export default class HorizontalCarousel<Item> extends Component<
  HorizontalCarouselProps<Item>,
  HorizontalCarouselState
> {
  static propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    keyExtractor: PropTypes.func.isRequired,
    style: ViewPropTypes.style
  }

  private listComponent: FlatList<Item> | null = null

  constructor(props: HorizontalCarouselProps<Item>) {
    super(props)

    const { width } = Dimensions.get("window")

    this.state = { width, scrollAnimation: new Animated.Value(0) }

    this.state.scrollAnimation.setValue(this.offsetForItem(0))

    Dimensions.addEventListener("change", this.updateWidth)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.updateWidth)
  }

  componentDidMount() {
    this.scrollToItem(0, false)
  }

  private updateWidth = ({ window }: { window: ScaledSize }) => {
    this.setState({ width: window.width })
  }

  private contentInset() {
    const horizontalInset = (this.state.width - CARD_WIDTH) / 2

    return { top: 0, right: horizontalInset, bottom: 0, left: horizontalInset }
  }

  private scrollToItem(index: number, animated: boolean = true) {
    this.scrollToOffset(this.offsetForItem(index), animated)
  }

  private scrollToOffset(offset: number, animated: boolean = true) {
    if (this.listComponent == null) return

    this.listComponent.scrollToOffset({
      offset,
      animated
    })
  }

  private offsetForItem(index: number) {
    return CARD_WIDTH * index - this.contentInset().left
  }

  private renderItem = (info: ListRenderItemInfo<Item>) => {
    const { index } = info

    const centerOffset = this.offsetForItem(index)
    const startOffset = centerOffset - CARD_WIDTH / 2
    const endOffset = centerOffset + CARD_WIDTH / 2

    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              {
                scale: this.state.scrollAnimation.interpolate({
                  inputRange: [startOffset, centerOffset, endOffset],
                  outputRange: [0.9, 1.0, 0.9],
                  extrapolate: "clamp"
                })
              }
            ]
          }
        ]}
      >
        {this.props.renderItem(info)}
      </Animated.View>
    )
  }

  render() {
    const { data, keyExtractor, style } = this.props
    return (
      <Animated.FlatList
        ref={(ref: any) => (this.listComponent = ref && ref.getNode())}
        style={style}
        contentInset={this.contentInset()}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
        horizontal
        snapToAlignment="center"
        snapToInterval={CARD_WIDTH}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: this.state.scrollAnimation
                }
              }
            }
          ],
          { useNativeDriver: true }
        )}
      />
    )
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    width: CARD_WIDTH,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "white",
    shadowColor: "black",
    borderRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6
  }
})
