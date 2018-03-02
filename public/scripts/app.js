'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IndecisionApp = function (_React$Component) {
  _inherits(IndecisionApp, _React$Component);

  function IndecisionApp(props) {
    _classCallCheck(this, IndecisionApp);

    var _this = _possibleConstructorReturn(this, (IndecisionApp.__proto__ || Object.getPrototypeOf(IndecisionApp)).call(this, props));

    _this.restoNameCallback = _this.restoNameCallback.bind(_this);
    _this.getDealsFromAPICallback = _this.getDealsFromAPICallback.bind(_this);
    _this.state = {
      RestaurentNames: [],
      Deals: []
    };
    return _this;
  }

  _createClass(IndecisionApp, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.RestoNames();
      this.getDealsFromAPI();
    }
  }, {
    key: 'RestoNames',
    value: function RestoNames() {
      $.getJSON('http://127.0.0.1:1234/getNames?callback=?', this.restoNameCallback);
    }
  }, {
    key: 'restoNameCallback',
    value: function restoNameCallback(results) {
      this.setState({ RestaurentNames: results });
    }
  }, {
    key: 'getDealsFromAPI',
    value: function getDealsFromAPI() {
      $.getJSON('http://127.0.0.1:1234/getDeals?callback=?', this.getDealsFromAPICallback);
    }
  }, {
    key: 'getDealsFromAPICallback',
    value: function getDealsFromAPICallback(results) {
      this.setState({ Deals: results });
    }
  }, {
    key: 'render',
    value: function render() {
      var title = 'Top Chef';
      var subtitle = 'Get good deals on great restaurents';

      return React.createElement(
        'div',
        { className: 'Screen' },
        React.createElement(Header, { title: title, subtitle: subtitle }),
        React.createElement(Options, {
          data: this.state.Deals
        })
      );
    }
  }]);

  return IndecisionApp;
}(React.Component);

var Header = function (_React$Component2) {
  _inherits(Header, _React$Component2);

  function Header() {
    _classCallCheck(this, Header);

    return _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
  }

  _createClass(Header, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'navbar navbar-inverse' },
        React.createElement(
          'h1',
          null,
          this.props.title
        ),
        React.createElement(
          'h2',
          null,
          this.props.subtitle
        )
      );
    }
  }]);

  return Header;
}(React.Component);

var Options = function (_React$Component3) {
  _inherits(Options, _React$Component3);

  function Options() {
    _classCallCheck(this, Options);

    return _possibleConstructorReturn(this, (Options.__proto__ || Object.getPrototypeOf(Options)).apply(this, arguments));
  }

  _createClass(Options, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-md-4' },
          this.props.data.map(function (info) {
            return React.createElement(Option, {
              key: info._id,
              info: info });
          })
        )
      );
    }
  }]);

  return Options;
}(React.Component);

var Option = function (_React$Component4) {
  _inherits(Option, _React$Component4);

  function Option() {
    _classCallCheck(this, Option);

    return _possibleConstructorReturn(this, (Option.__proto__ || Object.getPrototypeOf(Option)).apply(this, arguments));
  }

  _createClass(Option, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-block' },
          React.createElement(
            'p',
            { className: 'card-title' },
            this.props.info.name
          ),
          React.createElement(
            'p',
            null,
            this.props.info.description
          ),
          this.props.info.deals.map(function (deal) {
            return React.createElement(Deal, { deal: deal });
          })
        )
      );
    }
  }]);

  return Option;
}(React.Component);

var Deal = function (_React$Component5) {
  _inherits(Deal, _React$Component5);

  function Deal() {
    _classCallCheck(this, Deal);

    return _possibleConstructorReturn(this, (Deal.__proto__ || Object.getPrototypeOf(Deal)).apply(this, arguments));
  }

  _createClass(Deal, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'deal' },
          React.createElement(
            'p',
            null,
            this.props.deal
          )
        )
      );
    }
  }]);

  return Deal;
}(React.Component);

ReactDOM.render(React.createElement(IndecisionApp, null), document.getElementById('app'));
