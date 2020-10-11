import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Alert,
  Tree,
  ColorPicker,
  Select,
  Option,
  Radio,
  Image,
  Tag,
  RadioGroup,
  Loading,
  Popover,
  Cascader,
  Collapse,
  CollapseItem,
  TabPane,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  CheckboxGroup,
  TimeSelect,
  Tabs,
  TimePicker,
  buttonGroup,
  datePicker,
  Checkbox,
  Upload,
  Footer
} from 'element-ui'

// import TimeLine from './timeline/index.js'
// import TimeLineItem from './timeline-item/index.js'

let messageInstance = null
const resetMessage = (options) => {
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = Message(options)
}
['error', 'success', 'info', 'warning'].forEach(type => {
  resetMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return resetMessage(options)
  }
})

Vue.use(Tabs)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(TimePicker)
Vue.use(Alert)
Vue.use(Popover)
Vue.use(Cascader)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(TabPane)
Vue.use(TimeSelect)
Vue.use(Divider)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(ColorPicker)
Vue.use(buttonGroup)
Vue.use(Footer)
Vue.use(datePicker)
Vue.use(Image)
Vue.prototype.$message = resetMessage
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$loading = Loading.service
