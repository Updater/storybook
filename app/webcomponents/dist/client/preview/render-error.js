'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = '\n  <style>\n    .error {\n      background-color: #ff4747;\n      font-size: 24px;\n    }\n  </style>\n  <div class="error">\n    <slot></slot>\n  </div>\n';

var tpl = document.createElement('template');
tpl.appendChild(document.createRange().createContextualFragment(template));

var Error = function (_HTMLElement) {
  (0, _inherits3.default)(Error, _HTMLElement);

  function Error() {
    (0, _classCallCheck3.default)(this, Error);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Error.__proto__ || (0, _getPrototypeOf2.default)(Error)).call(this));

    _this.attachShadow({ mode: 'open' }).appendChild(tpl.content.cloneNode(true));
    return _this;
  }

  return Error;
}(HTMLElement);

customElements.define('storybook-error', Error);