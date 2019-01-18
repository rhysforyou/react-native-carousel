# React Native Carousel

This package provides a simple, performant carousel component for React Native apps, with no native dependencies.

![A demo of the library in action](https://raw.githubusercontent.com/rhysforyou/react-native-horizontal-carousel/master/demo.gif)

[View this demo in Expo](https://snack.expo.io/SklK-ARM4)

## Installation

With Yarn

```sh
yarn add @rhysforyou/react-native-carousel
```

With npm:

```
npm install --save @rhysforyou/react-native-carousel
```

## Usage

If you've ever used React Native's `FlatList` component, you'll be right at home:

```jsx
<Carousel
  data={[
    {
      id: "1",
      title: "Carousel",
      description: "A handy component for React Native"
    }
    // ...
  ]}
  renderItem={info => (
    <View>
      <Text style={styles.title}>{info.item.title}</Text>
      <Text style={styles.description}>{info.item.description}</Text>
    </View>
  )}
  keyExtractor={item => item.id}
/>
```

## API

### Props

- [`style`](#style)
- [`data`](#data)
- [`renderItem`](#renderItem)
- [`keyExtractor`](#keyExtractor)

---

#### `style`

A set of styles to apply to the underlying `FlatList` component.

| Type                                                                         | Required |
| :--------------------------------------------------------------------------- | :------- |
| [view styles](https://facebook.github.io/react-native/docs/view-style-props) | false    |

#### `data`

A plain array of data items to be rendered by the carousel.

| Type  | Required |
| :---- | :------- |
| array | true     |

#### `renderItem`

```js
renderItem({ item: Object, index: number, separators: { highlight: Function, unhighlight: Function, updateProps: Function(select: string, newProps: Object) } }) => ?React.Element
```

Takes an item from `data` and renders it into the carousel, wrapping it in a card view of fixed width.

For more information see the [`FlatList` docs](https://facebook.github.io/react-native/docs/flatlist#renderitem).

| Type     | Required |
| :------- | :------- |
| function | true     |

#### `keyExtractor`

```js
keyExtractor(item: Object, index: number) => string
```

Takes an item from `data` and its `index` and returns a unique key.

| Type     | Required |
| :------- | :------- |
| function | true     |
