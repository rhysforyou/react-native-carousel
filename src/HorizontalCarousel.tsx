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

export interface CarouselProps<Item> {
  /**
   * A plain array of data items to be rendered by the carousel.
   */
  data: any[]

  /**
   * Takes an item from `data` and renders it into the carousel, wrapping it in a card view of fixed width.
   *
   * For more information see the [`FlatList` docs](https://facebook.github.io/react-native/docs/flatlist#renderitem).
   */
  renderItem: ListRenderItem<Item>

  /**
   * Takes an item from `data` and its `index` and returns a unique key.
   */
  keyExtractor: (item: Item, index: number) => string

  /**
   * A set of styles to apply to the underlying `FlatList` component.
   */
  style?: StyleProp<ViewStyle>

  /**
   * These styles will be applied to the scroll view content container which wraps all of the child views.
   */
  contentContainerStyle?: StyleProp<ViewStyle>

  /**
   * These styles will be applied to the cards used to contain each carousel item.
   */
  cardStyle?: StyleProp<ViewStyle>
}

interface CarouselState {
  width: number
  scrollAnimation: Animated.Value
}

export default class Carousel<Item> extends Component<
  CarouselProps<Item>,
  CarouselState
> {
  public static propTypes = {
    data: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    keyExtractor: PropTypes.func.isRequired,
    style: ViewPropTypes.style
  }

  private listComponent: FlatList<Item> | null = null

  public constructor(props: CarouselProps<Item>) {
    super(props)

    const { width } = Dimensions.get("window")

    this.state = { width, scrollAnimation: new Animated.Value(0) }

    this.state.scrollAnimation.setValue(this.offsetForItem(0))

    Dimensions.addEventListener("change", this.updateWidth)
  }

  public componentWillUnmount() {
    Dimensions.removeEventListener("change", this.updateWidth)
  }

  public componentDidMount() {
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
          this.props.cardStyle,
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

  public render() {
    const { data, keyExtractor, style, contentContainerStyle } = this.props
    return (
      <Animated.FlatList
        ref={(ref: any) => (this.listComponent = ref && ref.getNode())}
        style={style}
        contentContainerStyle={contentContainerStyle}
        contentInset={this.contentInset()}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
        horizontal
        snapToAlignment="center"
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
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
