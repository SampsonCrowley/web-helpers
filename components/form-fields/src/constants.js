export const
  // one or more digits and an optional '.' separator plus two digits for cents or empty string
  currencyPattern   = '^[0-9]+((\\.[0-9]{2})$|$)',
  currencyRegex     = new RegExp(currencyPattern),
  currencyFeedback  = "Enter an amount in US Dollars",
  currencyFormat    = function(val) {
                        val = `${val}`.replace(/[^0-9.]/g, '')
                        if(/\./.test(val)) {
                          val = val.split('.')
                          val[1] = `${val[1]}00`.slice(0, 2)
                          val = `${val[0] || '0'}.${val[1]}`
                        } else {
                          val = (val || '0') + '.00'
                        }
                        return val
                      },


  emailPattern  = '('
                    // empty strings are allowed
                    + '^$|'
                    // address cannot start with a period
                    + '^[^@\\s;.\\/\\[\\]\\\\]+'
                    // any '.' separators must be followed by valid characters
                    + '(\\.[^@\\s;.\\/\\[\\]\\\\]+)*'
                    // @ sign, obviously
                    + '@'
                    // domain cannot start with a period
                    + '[^@\\s;.\\/\\[\\]\\\\]+'
                    // any '.' separators must be followed by valid characters
                    + '(\\.[^@\\s;.\\/\\[\\]\\\\]+)*'
                    // must end with a TLD
                    + '\\.[^@\\s;.\\/\\[\\]\\\\]+$'
                    + ')',
  emailRegex    = new RegExp(emailPattern),
  emailFeedback = 'Enter a Valid Email (i.e. myemail@email.com)',


  phoneChars    = /^[-()#=;a-z ]/,
  phonePattern  = '('
                    // empty strings are allowed
                    + '^$|'
                    // nest group to allow extensions
                    + '('
                    // domestic australian phones
                    + '^04[0-9]{2}\\s*[0-9]{3}\\s*[0-9]{3}|'
                    // domestic US phones
                    + '^\\(?[2-9][0-9]{2}\\)?\\s*-?[0-9]{3}-?[0-9]{4}|'
                    // international phones with at least 11 digits
                    + '\\+.{11,}'
                    // RFC 3966 extension format
                    + ')(;ext=[0-9]+)?'
                    + ')',
  phoneRegex    = new RegExp(phonePattern),
  phoneFeedback = "Enter a Valid Phone Number;"
                  + " all numbers after the first 10 local digits will add an extension;"
                  + " for custom international formats start with '+' and use ';' to add an extension",
  phoneFormat = function (val) {
                  if(/^\+([^1]|$)/.test(val)) {
                    if(
                      this
                      && /;/.test(val)
                      && !/ext=[0-9]*$/.test(val)
                      && ((this._caretPosition || 0) > val.lastIndexOf(';'))
                      && (val.length > (val.lastIndexOf(';') + 1))
                    ) this._caretPosition = (this._caretPosition || 0) + 4

                    const full = val.length > (val.lastIndexOf(';') + 1)
                    val = val.split(';').map(v => v.replace(/[^+0-9]/g, '')).join(full ? ';ext=' : ';')

                  } else {
                    val = val.replace(/^\+?1/, '').replace(/[^0-9]/g, '')
                  }

                  if(val.length) {
                    switch (true) {
                      case /^\+6/.test(val):

                        if(val.length > 3) {
                          if(this && /^\+61\s*0/.test(val) && (this._caretPosition || 0 > 3)) this._caretPosition = (this._caretPosition || 0) - 1

                          val = val.slice(0, 3)
                            + ' '
                            + (
                              /^\+61/.test(val)
                                ? phoneFormat(('0' + val.slice(3)).replace(/^0+/, '0')).replace(/^0/, '')
                                : val.slice(3)
                            )
                        }
                        break;
                      case /^\+/.test(val):
                        break;
                      case /^04/.test(val):
                        if(val.length > 10) val = val.slice(0, 10) + ';ext=' + val.slice(10)
                        if(val.length > 7)  val = val.slice(0, 7) + ' ' + val.slice(7)
                        if(val.length > 4)  val = val.slice(0, 4) + ' ' + val.slice(4)
                        break;
                      case /^0/.test(val):
                        if(val.length > 10) val = val.slice(0, 10) + ';ext=' + val.slice(10)
                        if(val.length > 6)  val = val.slice(0, 6) + ' ' + val.slice(6)
                        if(val.length > 2)  val = val.slice(0, 2) + ' ' + val.slice(2)
                        break;
                      default:
                        if(val.length > 10) val = val.slice(0, 10) + ';ext=' + val.slice(10)
                        if(val.length > 6)  val = val.slice(0, 6) + '-' + val.slice(6)
                        if(val.length > 3)  val = '(' + val.slice(0, 3) + ') ' + val.slice(3)
                    }
                  }
                  return val
                },


  keyCodes =  {
                [8]:   "Backspace",
                [9]:   "Tab",
                [13]:  "Enter",
                [16]:  "Shift",
                [17]:  "Control",
                [18]:  "Alt",
                [19]:  "Pause",
                [20]:  "CapsLock",
                [27]:  "Escape",
                [33]:  "PageUp",
                [34]:  "PageDown",
                [35]:  "End",
                [36]:  "Home",
                [37]:  "ArrowLeft",
                [38]:  "ArrowUp",
                [39]:  "ArrowRight",
                [40]:  "ArrowDown",
                [45]:  "Insert",
                [46]:  "Delete",
                [91]:  "Meta",
                [92]:  "Meta",
                [93]:  "ContextMenu",
                [112]: "F1",
                [113]: "F2",
                [114]: "F3",
                [115]: "F4",
                [116]: "F5",
                [117]: "F6",
                [118]: "F7",
                [119]: "F8",
                [120]: "F9",
                [121]: "F10",
                [122]: "F11",
                [123]: "F12",
                [144]: "NumLock",
                [145]: "ScrollLock",
              },


  inputProperties = {
                      id: {
                        type: String,
                        reflect: true,
                      },
                      name: {
                        type: String,
                        reflect: true,
                      },
                      type: {
                        type: String,
                        reflect: true,
                      },
                      placeholder: {
                        type: String,
                        reflect: true,
                      },
                      label: {
                        attribute: false,
                        reflect: false,
                      },
                      required: {
                        type: Boolean,
                        reflect: true,
                      },
                      currencyFormat: {
                        type: Boolean,
                        reflect: true,
                      },
                      emailFormat: {
                        type: Boolean,
                        reflect: true,
                      },
                      phoneFormat: {
                        type: Boolean,
                        reflect: true,
                      },
                      phoneFormatOnBlur: {
                        type: Boolean,
                        reflect: true,
                      },
                      skipExtras: {
                        type: Boolean,
                        reflect: true,
                      },
                      badFormatMessage: {
                        attribute: false,
                        reflect: false,
                      },
                      looseCasing: {
                        attribute: false,
                        reflect: false,
                      },
                      feedback: {
                        attribute: false,
                        reflect: false,
                      },
                      value: {
                        type: String,
                        reflect: true,
                      },
                      validator: {
                        attribute: false,
                        reflect: false,
                      },
                    }
