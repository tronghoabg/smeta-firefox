window['SMETA_INFO'] = null
window['USD_RATE'] = null
window['INIT_SMETA_INFO'] = false
window['CURRENCY'] = null
var intervalId

window.addEventListener("message", function(event) {

  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + event.data.text);
    browser.runtime.sendMessage({hello: 1});
  }
}, false);



window['__smeta'] = (function () {
  const cached = {}
  const currency_symbols = {
    AED: 'د.إ',
    AFN: '؋',
    ALL: 'L',
    AMD: '֏',
    ANG: 'ƒ',
    AOA: 'Kz',
    ARS: '$',
    AUD: '$',
    AWG: 'ƒ',
    AZN: '₼',
    BAM: 'KM',
    BBD: '$',
    BDT: '৳',
    BGN: 'лв',
    BHD: '.د.ب',
    BIF: 'FBu',
    BMD: '$',
    BND: '$',
    BOB: '$b',
    BOV: 'BOV',
    BRL: 'R$',
    BSD: '$',
    BTC: '₿',
    BTN: 'Nu.',
    BWP: 'P',
    BYN: 'Br',
    BYR: 'Br',
    BZD: 'BZ$',
    CAD: '$',
    CDF: 'FC',
    CHE: 'CHE',
    CHF: 'CHF',
    CHW: 'CHW',
    CLF: 'CLF',
    CLP: '$',
    CNH: '¥',
    CNY: '¥',
    COP: '$',
    COU: 'COU',
    CRC: '₡',
    CUC: '$',
    CUP: '₱',
    CVE: '$',
    CZK: 'Kč',
    DJF: 'Fdj',
    DKK: 'kr',
    DOP: 'RD$',
    DZD: 'دج',
    EEK: 'kr',
    EGP: '£',
    ERN: 'Nfk',
    ETB: 'Br',
    ETH: 'Ξ',
    EUR: '€',
    FJD: '$',
    FKP: '£',
    GBP: '£',
    GEL: '₾',
    GGP: '£',
    GHC: '₵',
    GHS: 'GH₵',
    GIP: '£',
    GMD: 'D',
    GNF: 'FG',
    GTQ: 'Q',
    GYD: '$',
    HKD: '$',
    HNL: 'L',
    HRK: 'kn',
    HTG: 'G',
    HUF: 'Ft',
    IDR: 'Rp',
    ILS: '₪',
    IMP: '£',
    INR: '₹',
    IQD: 'ع.د',
    IRR: '﷼',
    ISK: 'kr',
    JEP: '£',
    JMD: 'J$',
    JOD: 'JD',
    JPY: '¥',
    KES: 'KSh',
    KGS: 'лв',
    KHR: '៛',
    KMF: 'CF',
    KPW: '₩',
    KRW: '₩',
    KWD: 'KD',
    KYD: '$',
    KZT: '₸',
    LAK: '₭',
    LBP: '£',
    LKR: '₨',
    LRD: '$',
    LSL: 'M',
    LTC: 'Ł',
    LTL: 'Lt',
    LVL: 'Ls',
    LYD: 'LD',
    MAD: 'MAD',
    MDL: 'lei',
    MGA: 'Ar',
    MKD: 'ден',
    MMK: 'K',
    MNT: '₮',
    MOP: 'MOP$',
    MRO: 'UM',
    MRU: 'UM',
    MUR: '₨',
    MVR: 'Rf',
    MWK: 'MK',
    MXN: '$',
    MXV: 'MXV',
    MYR: 'RM',
    MZN: 'MT',
    NAD: '$',
    NGN: '₦',
    NIO: 'C$',
    NOK: 'kr',
    NPR: '₨',
    NZD: '$',
    OMR: '﷼',
    PAB: 'B/.',
    PEN: 'S/.',
    PGK: 'K',
    PHP: '₱',
    PKR: '₨',
    PLN: 'zł',
    PYG: 'Gs',
    QAR: '﷼',
    RMB: '￥',
    RON: 'lei',
    RSD: 'Дин.',
    RUB: '₽',
    RWF: 'R₣',
    SAR: '﷼',
    SBD: '$',
    SCR: '₨',
    SDG: 'ج.س.',
    SEK: 'kr',
    SGD: 'S$',
    SHP: '£',
    SLL: 'Le',
    SOS: 'S',
    SRD: '$',
    SSP: '£',
    STD: 'Db',
    STN: 'Db',
    SVC: '$',
    SYP: '£',
    SZL: 'E',
    THB: '฿',
    TJS: 'SM',
    TMT: 'T',
    TND: 'د.ت',
    TOP: 'T$',
    TRL: '₤',
    TRY: '₺',
    TTD: 'TT$',
    TVD: '$',
    TWD: 'NT$',
    TZS: 'TSh',
    UAH: '₴',
    UGX: 'USh',
    USD: '$',
    UYI: 'UYI',
    UYU: '$U',
    UYW: 'UYW',
    UZS: 'лв',
    VEF: 'Bs',
    VES: 'Bs.S',
    VND: '₫',
    VUV: 'VT',
    WST: 'WS$',
    XAF: 'FCFA',
    XBT: 'Ƀ',
    XCD: '$',
    XOF: 'CFA',
    XPF: '₣',
    XSU: 'Sucre',
    XUA: 'XUA',
    YER: '﷼',
    ZAR: 'R',
    ZMW: 'ZK',
    ZWD: 'Z$',
    ZWL: '$'
  }
  let symbols = Array.from(
    Object.keys(currency_symbols).map(k => currency_symbols[k])
  )
  symbols.sort((a, b) => b.length - a.length)

  function parseLocaleNumber (stringNumber) {
    const regex = /(?<sep>[.,])[\d]{1,2}$/
    const regex2 = /(?<sep>[.,])[\d]{3}$/
    let s = stringNumber.replace(/\s+/g, '')
    let thousandSeparator = null
    let decimalSeparator = null
    let m = s.match(regex)
    if (m) {
      decimalSeparator = m.groups['sep']
      thousandSeparator = decimalSeparator === '.' ? ',' : '.'
    } else {
      m = s.match(regex2)
      if (m) {
        thousandSeparator = m.groups['sep']
        decimalSeparator = thousandSeparator === '.' ? ',' : '.'
      }
    }

    if (thousandSeparator) {
      let a = s.split(thousandSeparator)
      if (a.length > 1 && a[0].length > 3) {
        return null
      }
      for (let i = 1; i < a.length - 1; i++) {
        if (a[i].length !== 3) return null
      }

      return parseFloat(
        s
          .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
          .replace(new RegExp('\\' + decimalSeparator), '.')
      )
    } else {
      return parseFloat(s)
    }
  }

  function parseCurrency (text) {
    const regex = /(?<pre>[^0-9\-])?(?<value>[0-9., ]+)(?<post>[^0-9\-.,])?/
    const m = text.match(regex)
    if (m) {
      return {
        symbol: m.groups['pre'] || m.groups['post'],
        raw: m.groups['value'],
        value: parseLocaleNumber(m.groups['value'])
      }
    }

    return null
  }

  function defaultCurrencySymbol () {
    return currency_symbols[cached['defaultCurrency']]
  }

  function clear () {
    cached = {}
    _isGettingAdsAccountData = {}
  }

  function traverse (root, callback, context) {
    root = callback(root)
    if ('__skip' in root && root.__skip === true) return

    if (root && 'children' in root) {
      for (const child of root.children) {
        traverse(child, callback, context)
      }
    }
  }

  function isCurrency (text, defaultValue = null) {
    let s = null
    let e = null

    if (!defaultValue) defaultValue = defaultCurrencySymbol()
    if (defaultValue) {
      if (text.startsWith(defaultValue)) {
        s = defaultValue
      }
      if (text.endsWith(defaultValue)) {
        e = defaultValue
      }
    }

    s = s ? s : symbols.find(s => text.startsWith(s))
    e = e ? e : symbols.find(s => text.endsWith(s))

    if ((!s && !e) || (s && e)) {
      return false
    }
    let regex = null
    if (s) {
      regex = new RegExp('^' + s.replace('$', '\\$') + '[\\d,. ]+' + '$')
    } else if (e) {
      regex = new RegExp('^[\\d,. ]+' + e.replace('$', '\\$') + '$')
    } else {
      return false
    }
    return text.match(regex) !== null
  }

  function convertCurrencyCore (node, currency) {
    if (currency === 'VND' || currency === 'USD') {
      let objRate = getRateCurrent()

      if (objRate === null || objRate.currency === currency) {
        return
      }
      window['__smeta'].traverse(
        node,
        sub => {
          if (
            sub.tagName === 'SPAN' &&
            sub.childNodes.length === 1 &&
            sub.childNodes[0].nodeType === 3 &&
            isCurrency(sub.childNodes[0].nodeValue)
          ) {
            if (!sub.hasAttribute('__smeta_ignore')) {
              const d = sub.childNodes[0].nodeValue.split('~')
              let c = window['__smeta'].parseCurrency(d[0])
              if (c) {
                let usd =
                  Number(
                    ((10 * c.value) / objRate.rate / 10).toFixed(2)
                  ).toLocaleString('vi-VN') + ' $ '
                let vnd =
                  (
                    (Math.round((10 * c.value) / objRate.rate) / 10) *
                    25450
                  ).toLocaleString('en-US') + ' đ '
                sub.setAttribute(
                  'title',
                  `${objRate.currency}: ${sub.childNodes[0].nodeValue}\nUSD: ${
                    objRate.currency === 'USD'
                      ? sub.childNodes[0].nodeValue
                      : usd
                  }\nVND: ${
                    objRate.currency === 'VND'
                      ? sub.childNodes[0].nodeValue
                      : vnd
                  }`
                )
                sub.classList.add('smeta_currency')
                sub.childNodes[0].nodeValue = currency === 'USD' ? usd : vnd
                sub.__skip = true
              }
            }
          }
          return sub
        },
        null
      )
    }
  }

  function convertCurrency (node) {
    if (window['CURRENCY']) {
      convertCurrencyCore(node, window['CURRENCY'])
    } else {
      chrome.storage.local
        .get('currency')
        .then(result => {
          window['CURRENCY'] = result.currency
          convertCurrencyCore(node, window['CURRENCY'])
        })
        .catch(e => console.log('cover currency default'))
    }
  }

  return {
    getToken: getToken,
    getAct: getAct,
    clear: clear,
    traverse: traverse,
    parseCurrency: parseCurrency,
    isCurrency: isCurrency,
    convertCurrency: convertCurrency,
    symbols: symbols
  }
})()

const objBillName = {
  s_status: '<i class="fa-solid fa-signal"></i> Trạng Thái',
  s_id: '<i class="fa-regular fa-id-card"></i> ID',
  s_name: '<i class="fa-solid fa-user"></i> Tên TK',
  s_balance: '<i class="fa-solid fa-wallet"></i> Dư nợ',
  s_threshold: '<i class="fa-solid fa-ruler-horizontal"></i> Ngưỡng',
  s_adtrust: '<i class="fa-solid fa-gauge-simple-high"></i> Limit ngày',
  s_adtrust_new: '<i class="fa-solid fa-gauge-high"></i> Limit ',
  s_spent: '<i class="fa-solid fa-dollar-sign"></i> Chi tiêu',
  s_admin: '<i class="fa-solid fa-user-shield"></i> Admin',
  s_currency: '<i class="fa-solid fa-dollar-sign"></i> Tiền tệ',
  s_acctype: '<i class="fa-solid fa-user-tie"></i> Loại TK',
  s_card: `<i class="fa-solid fa-credit-card"></i> Thẻ`,
  s_created_time: '<i class="fa-regular fa-calendar"></i> Ngày tạo',
  s_timezone: '<i class="fa-solid fa-earth-americas"></i> Múi giờ',
  s_role: '<i class="fa-solid fa-user-gear"></i> Quyền'
}

async function reqAPI (url, method, body, mode) {
  let response = await fetch(url, {
    method: method,
    credentials: 'include',
    body: body,
    mode: mode,
    headers: {
      referer: 'https://business.facebook.com/adsmanager/manage/accounts'
    }
  })
  let html = await response.text().then(res => res)
  return html
}

function getAct () {
  const urlSearchParams = new URLSearchParams(document.location.search)
  return urlSearchParams.get('act') || urlSearchParams.get('asset_id')
}

function fadeOutEffect (id) {
  var fadeTarget = document.getElementById(id)
  var fadeEffect = setInterval(function () {
    if (!fadeTarget.style.opacity) {
      fadeTarget.style.opacity = 1
    }
    if (fadeTarget.style.opacity > 0) {
      fadeTarget.style.opacity -= 0.1
      fadeTarget.style.visibility = 'hidden'
    } else {
      clearInterval(fadeEffect)
    }
  }, 150)
}

async function getAdAccountInfo () {
  if (window['SMETA_INFO']) {
    return window['SMETA_INFO']
  }

  if (window['INIT_SMETA_INFO'] === true) {
    while (window['INIT_SMETA_INFO'] === true) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  if (window['SMETA_INFO']) {
    return window['SMETA_INFO']
  }

  window['INIT_SMETA_INFO'] = true
  var token = await getToken()
  let act = getAct()
  let url = `https://graph.facebook.com/v15.0/act_${act}?fields=business,owner_business,name,account_id,disable_reason,account_status,currency,adspaymentcycle,adtrust_dsl,balance,amount_spent,account_currency_ratio_to_usd,users,all_payment_methods{pm_credit_card{display_string,exp_month,exp_year,is_verified}},created_time,next_bill_date,timezone_name,timezone_offset_hours_utc,insights.date_preset(maximum){spend},userpermissions,owner,is_prepay_account&summary=true&access_token=${token.token}`

  let json = await reqAPI(url, 'GET')
  let obj = JSON.parse(json)
  var objAcc = {
    s_status: '',
    s_id: 'null',
    s_name: '',
    s_balance: '',
    s_threshold: '*',
    s_adtrust: '',
    s_adtrust_new: '',
    s_spent: '',
    s_admin: '',
    s_currency: '',
    s_acctype: '',
    s_card: '',
    s_created_time: '',
    s_timezone: '',
    s_role: '',
    h_balance: '',
    h_threshold: '*',
    h_adtrust: '',
    h_adtrust_new: '',
    h_spent: '',
    h_bm: ''
  }

  let extra = await getBillingExtra(token.fbdt, act, obj.currency)
  objAcc.s_status = getStatusAcc(obj.account_status)
  objAcc.s_id = obj.account_id
  objAcc.s_name = obj.name
  objAcc.s_balance = coverCurrency(extra.balance, obj.currency)
  if (obj.adspaymentcycle) {
    let threshold = obj.adspaymentcycle.data[0].threshold_amount
    threshold = coverCurrency(threshold, obj.currency)
    objAcc.s_threshold = threshold
  } else {
    objAcc.s_threshold = '-'
  }
  objAcc.s_adtrust =
    obj.adtrust_dsl == -1 ? 'No limit' : coverCurrency(obj.adtrust_dsl, 'round')
  objAcc.s_adtrust_new = coverCurrency(extra.newlimit, obj.currency)
  let spend = obj.insights ? obj.insights.data[0].spend : 0

  objAcc.s_spent = coverCurrency(spend, 'round')

  objAcc.s_currency = obj.currency
  if (!obj.business) {
    objAcc.s_acctype = 'Cá nhân'
  } else {
    objAcc.s_acctype = 'Doanh Nghiệp'
  }
  var card = ''
  if (obj.iprepay_account) {
    card = 'Trả Trước'
  } else if (obj.all_payment_methods) {
    var cardInfo = obj.all_payment_methods.pm_credit_card.data[0]
    card = `${cardInfo.display_string} (${cardInfo.exp_month}/${cardInfo.exp_year})`
  }
  objAcc.s_card = card
  objAcc.s_created_time = obj.created_time.slice(0, 10)
  objAcc.s_timezone = `${obj.timezone_offset_hours_utc} | ${obj.timezone_name}`
  var objRole = obj.userpermissions ? obj.userpermissions.data : []
  objAcc.s_admin = objRole.length

  var user_id = ''
  var html_src = document.documentElement.outerHTML
  try {
    var user_id = html_src.split('personal_user_id":"')[1].split('"')[0]
  } catch (error) {
    try {
      var user_id = html_src.split('actorID":"')[1].split('"')[0]
    } catch (error) {}
  }

  var role = 'Không xác định'

  for (var member of objRole) {
    var id = member.user ? member.user.id : 'none'
    if (id == user_id) {
      switch (member.role) {
        case 'ADMIN':
          role = 'Quản trị viên'
          break
        case 'REPORTS_ONLY':
          role = 'Nhà phân tích'
          break
        case 'GENERAL_USER':
          role = 'Nhà quảng cáo'
          break
        default:
          role = member.role
      }
      break
    }
  }
  objAcc.s_role = role
  objAcc.h_balance = coverCurrency(
    objAcc.s_balance / obj.account_currency_ratio_to_usd,
    'round'
  )
  objAcc.h_threshold = !isNaN(objAcc.s_threshold)
    ? coverCurrency(
        objAcc.s_threshold / obj.account_currency_ratio_to_usd,
        'round'
      )
    : '-'
  objAcc.h_adtrust =
    objAcc.s_adtrust != 'No limit'
      ? coverCurrency(
          objAcc.s_adtrust / obj.account_currency_ratio_to_usd,
          'round'
        )
      : 'No Limit'
  objAcc.h_adtrust_new =
    objAcc.s_adtrust_new != '-'
      ? coverCurrency(
          objAcc.s_adtrust_new / obj.account_currency_ratio_to_usd,
          'round'
        )
      : '-'
  objAcc.h_spent = coverCurrency(
    objAcc.s_spent / obj.account_currency_ratio_to_usd,
    'round'
  )
  objAcc.h_bm = obj.business ? obj.business.id : '-'
  window['SMETA_INFO'] = objAcc
  window['INIT_SMETA_INFO'] = false
  return objAcc
}

async function getBillingExtra (fbdt, act, currency) {
  var origin = window.location.origin
  var url = `${origin}/api/graphql`
  let formData = new FormData()

  formData.append('fb_dtsg', fbdt)
  formData.append('doc_id', '6401661393282937')
  formData.append('variables', `{"assetID":${act}}`)
  let res = await reqAPI(url, 'POST', formData)
  try {
    let formatted_dsl = res.split('"formatted_dsl":"')[1].split('",')[0]
    var newlimit = formatted_dsl
      .replace(/\\u[\dA-Fa-f]{4}/g, '')
      .replace(/[^\d]/g, '')
    let balance_new = res
      // .split('"account_balance":{"currency":"USD","amount_with_offset":"')[1]
      .split('"account_balance":{')[1]
      .split('"}')[0]
      .split('amount_with_offset":"')[1]
      .split('"')[0]
    let arr = [
      'CLP',
      'COP',
      'CRC',
      'HUF',
      'ISK',
      'IDR',
      'JPY',
      'KRW',
      'PYG',
      'TWD',
      'VND'
    ]
    if (arr.includes(currency)) {
      balance_new = Number(balance_new) / 100
    }

    let obj = {
      balance: Number(balance_new),
      newlimit: Number(newlimit)
    }
    return obj
    return Number(newlimit)
  } catch (error) {
    return {
      balance: '-',
      newlimit: '-'
    }
  }
}

function coverCurrency (num, currency) {
  num = +num
  if (currency == 'round') {
    return Math.round((num + Number.EPSILON) * 10) / 10
  }
  let arr = [
    'CLP',
    'COP',
    'CRC',
    'HUF',
    'ISK',
    'IDR',
    'JPY',
    'KRW',
    'PYG',
    'TWD',
    'VND'
  ]
  let currencies = 100
  if (arr.includes(currency)) {
    currencies = 1
  }
  return Math.round((num / currencies + Number.EPSILON) * 10) / 10
}

function getStatusAcc (num) {
  let astatus = ''
  switch (num) {
    case 1:
      astatus = 'Hoạt động'
      break
    case 2:
      astatus = 'Vô hiệu'
      break
    case 3:
      astatus = 'Dư Nợ'
      break
    case 7:
      astatus = 'Pending Review'
      break
    case 8:
      astatus = 'Pending Settlement'
      break
    case 9:
      astatus = 'Ân hạn'
      break
    case 100:
      astatus = 'Pending Closure'
      break
    case 101:
      astatus = 'Đóng'
      break
    case 201:
      astatus = 'Any Active'
      break
    case 202:
      astatus = 'Any Close'
      break
    default:
      astatus = 'Unknow'
      break
  }
  return astatus
}

async function smetaPopUp () {
  let now = getTimeCurrent()
  let html = `
<div id="smeta_offical" style="display: flex !important">
 
  <div class="main" id="fmain">
    <div class="header popup">
        <img src=${chrome.runtime.getURL('access/icon/logo.png')} alt="sMeta">
        <span class="update-at">Update: ${now}<span>
    </div>
    <ul class="list" id="list-show">
        <div class="popup_load">
            <img src=${chrome.runtime.getURL('access/icon/loading.gif')}>
        </div>
    </ul>
    <div class="s-footer">
    </div>
  </div>
  </div>
  `
  let wrapperObj = document.querySelector('body>div')
  wrapperObj.insertAdjacentHTML('beforeend', html)
  let btnShow = document.querySelector('#smeta_offical')
  let ftable = document.querySelector('#fmain')
  let list = document.getElementById('list-show')

  var tempHTML = ''
  let obj = await getAdAccountInfo()

  for (var info in obj) {
    var type_currency = obj.s_currency
    if (info.slice(0, 2) == 's_') {
      switch (info) {
        case 's_balance':
          tempHTML += `<li><p>${
            objBillName[info]
          }</p><div><span __smeta_ignore class='r s_balance'>${obj[
            info
          ].toLocaleString('en-US')} ${
            isNaN(obj[info]) ? '' : type_currency
          }</span><span __smeta_ignore class='g h_balance'>${
            obj['h_balance']
          } ${isNaN(obj[info]) ? '' : '$'}</span></div></li>`
          break
        case 's_adtrust':
          tempHTML += `<li><p>${
            objBillName[info]
          }</p><div><span __smeta_ignore class='r s_adtrust'>${obj[
            info
          ].toLocaleString('en-US')} ${
            isNaN(obj[info]) ? '' : type_currency
          }</span><span __smeta_ignore class='g h_adtrust'>${
            obj['h_adtrust']
          } ${isNaN(obj[info]) ? '' : '$'}</span></div></li>`
          break
        case 's_adtrust_new':
          tempHTML += `<li><p>${
            objBillName[info]
          }</p><div><span __smeta_ignore class='p s_adtrust_new'>${obj[
            info
          ].toLocaleString('en-US')} ${
            isNaN(obj[info]) ? '' : type_currency
          }</span><span __smeta_ignore class='g h_adtrust_new'>${
            obj['h_adtrust_new']
          } ${isNaN(obj[info]) ? '' : '$'}</span></div></li>`
          break
        case 's_spent':
          tempHTML += `<li><p>${
            objBillName[info]
          }</p><div><span __smeta_ignore class='r s_spent'>${obj[
            info
          ].toLocaleString('en-US')} ${
            isNaN(obj[info]) ? '' : type_currency
          }</span><span __smeta_ignore class='g h_spent'>${obj['h_spent']} ${
            isNaN(obj[info]) ? '' : '$'
          }</span></div></li>`
          break
        case 's_threshold':
          tempHTML += `<li><p>${
            objBillName[info]
          }</p><div><span __smeta_ignore class='r s_threshold'>${obj[
            info
          ].toLocaleString('en-US')} ${
            isNaN(obj[info]) ? '' : type_currency
          }</span><span __smeta_ignore class='g h_threshold'>${
            obj['h_threshold']
          } ${isNaN(obj[info]) ? '' : '$'}</span></div></li>`
          break
        default:
          tempHTML += `<li><p>${objBillName[info]}</p><p>${obj[info]}</p></li>`
      }
    }
    list.innerHTML = `
    <li>
      <p><i class="fa-solid fa-arrow-rotate-right"></i>Cập nhật realTime</p>
      <div class="toggle-switch">
        <input class="toggle-input" id="toggle" type="checkbox">
        <label class="toggle-label" for="toggle"></label>
      </div>
    </li>
    <li>
      <p><i class="fa-solid fa-money-bill-transfer"></i>Đổi tiền tệ</p>
      <select id="cover_currency">
      <option value="DEFAULT" selected>Mặc định</option>
      <option value="USD">USD</option>
      <option value="VND">VNĐ</option>
      </select>
    </li>${tempHTML}`
  }
  let footer = document.getElementsByClassName('s-footer')[0]
  footer.innerHTML = `
      <a class="link-ads" title="Tới trang quản lý chiến dịch" href="https://business.facebook.com/adsmanager/manage/campaigns?act=${obj.s_id}"><span>Ads</span></a>
      <a class="link-ads"  title="Tới trang thanh toán" href="https://business.facebook.com/ads/manager/account_settings/account_billing/?act=${obj.s_id}" ><span>Bill</span></a>
`

  let toggle = document.getElementById('toggle')
  chrome.storage.local
    .get('realtime')
    .then(result => {
      toggle.checked = result.realtime
      if (result.realtime) {
        intervalId = setInterval(reRender, 60000)
      }
    })

    .catch(e => console.log('e'))
  toggle.addEventListener('change', e => {
    chrome.storage.local.set({ realtime: e.target.checked })
    let realtimepopup = document.getElementById('realtime')

    if (e.target.checked) {
      if (realtimepopup) {
        realtimepopup.style.display = 'flex'
      }

      alertGreen('Cập nhận realtime được kích hoạt', 3000)
      intervalId = setInterval(reRender, 60000)
    } else {
      if (realtimepopup) {
        realtimepopup.style.display = 'none'
      }
      clearInterval(intervalId)
      alertGreen('Tắt cập nhật realtime thành công', 3000)
    }
  })

  let dropdown = document.getElementById('cover_currency')
  chrome.storage.local
    .get('currency')
    .then(result => {
      if (result.currency) {
        dropdown.value = result.currency
      }
    })
    .catch(e => console.log('e'))

  dropdown.addEventListener('change', e => {
    chrome.storage.local.set({ currency: e.target.value })
    window.location.reload()
  })

  let isDragging = false
  window.flag = false
  let dragStartX, dragStartY
  btnShow.addEventListener('mousedown', function (event) {
    isDragging = true
    dragStartX = event.clientX - btnShow.offsetLeft
    dragStartY = event.clientY - btnShow.offsetTop
  })
  document.addEventListener('mousemove', function (event) {
    if (isDragging) {
      const newPosX = event.clientX - dragStartX
      const newPosY = event.clientY - dragStartY
      btnShow.style.left = newPosX + 'px'
      btnShow.style.top = newPosY + 'px'
      btnShow.style.cursor = 'grabbing'
    }
  })

  document.addEventListener('mouseup', function () {
    btnShow.style.cursor = 'pointer'
    isDragging = false
  })

  btnShow.addEventListener('click', function (event) {
    if (event.target !== event.currentTarget) return
    if (isDragging) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      flag = ftable.style.opacity
      if (flag == 1) {
        ftable.style.opacity = 0
        ftable.style.visibility = 'hidden'
        ftable.style.width = '0'
      } else {
        ftable.style.opacity = 1
        ftable.style.visibility = 'visible'
        ftable.style.width = '300px'
      }
    }
  })
}

async function smetaPopUpRealTime () {
  let url = window.location.href
  if (!url.includes('adsmanager/manage')) {
    return
  }
  let html = `
  <div class="realtime" id="realtime">
  <div class="realtime-left">
      <div class="header lg-realtime">
          <img src=${chrome.runtime.getURL(
            'access/icon/logo.png'
          )} alt="sMeta" draggable="false">
      </div>
  </div>
  <div class="realtime_right">

      <div class="realtime_info">
          <div class="realtime_load">
              <img src=${chrome.runtime.getURL('access/icon/loading.gif')}>
          </div>
      </div>
      <span class="realtime_time update-at">Đang tải dữ liệu ...</span>
      <div class="control">
          <div class="realtime_btn" id="realtime_minisize"><i class="fa-solid fa-window-minimize"></i></i></div>
          <div class="realtime_btn" id="realtime_reload"><i class="fa-solid fa-arrow-rotate-right"></i></div>
      </div>
  </div>

</div>
  `

  let wrapperObj = document.querySelector('body>div')
  wrapperObj.insertAdjacentHTML('beforeend', html)

  let realtimepopup = document.getElementById('realtime')
  let btnReload = document.getElementById('realtime_reload')
  let btnClose = document.getElementById('realtime_minisize')
  renderSmetaRealTime()

  let isDragging = false
  window.flag = false
  let dragStartX, dragStartY
  realtimepopup.addEventListener('mousedown', function (event) {
    isDragging = true
    dragStartX = event.clientX - realtimepopup.offsetLeft
    dragStartY = event.clientY - realtimepopup.offsetTop
  })
  document.addEventListener('mousemove', function (event) {
    if (isDragging) {
      const newPosX = event.clientX - dragStartX
      const newPosY = event.clientY - dragStartY
      realtimepopup.style.left = newPosX + 'px'
      realtimepopup.style.top = newPosY + 'px'
      realtimepopup.style.cursor = 'grabbing'
    }
  })

  document.addEventListener('mouseup', function () {
    realtimepopup.style.cursor = 'pointer'
    isDragging = false
  })

  btnClose.onclick = function () {
    realtimepopup.style.display = 'none'
  }

  btnReload.onclick = function () {
    reRender()
  }
}

function renderSmetaRealTime () {
  let nodeTrigger = document.getElementsByClassName('realtime_info')
  if (nodeTrigger) {
    nodeTrigger[0].innerHTML = `
    <div class="realtime_load">
    <img src=${chrome.runtime.getURL('access/icon/loading.gif')}>
    </div>
    `
    getAdAccountInfo()
      .then(res => {
        nodeTrigger[0].innerHTML = `
<div class="realtime_frame">
  <p>Dư nợ</p>
  <div class="realtime_currency">
    <span __smeta_ignore="" class="r s_balance">
    ${res.s_balance.toLocaleString('en-US')}
    ${isNaN(res.s_balance) ? '' : res.s_currency}
    </span>
    <span __smeta_ignore="" class="g h_balance">
    ${res.h_balance}
    ${isNaN(res.h_balance) ? '' : '$'}
    </span>
  </div>
</div>
<div class="realtime_frame">
  <p>Ngưỡng</p>
  <div class="realtime_currency">
    <span __smeta_ignore="" class="r s_adtrust">
    ${res.s_threshold.toLocaleString('en-US')}
    ${isNaN(res.s_threshold) ? '' : res.s_currency}
    </span>
    <span __smeta_ignore="" class="g h_adtrust">
    ${res.h_threshold}
    ${isNaN(res.h_threshold) ? '' : '$'}
    </span>
  </div>
</div>  
        `
        let triggerTime = document.getElementsByClassName('update-at')
        for (let i = 0; i <= triggerTime.length - 1; i++) {
          triggerTime[i].innerHTML = `Update at: ${getTimeCurrent()}`
        }
      })
      .catch(e => console.log(e))
  }
}

function getTimeCurrent () {
  var d = new Date()
  return d.toLocaleString()
}

async function smetaBilling () {
  let url = window.location.href
  if (
    !url.includes('billing_hub/payment_settings') &&
    !url.includes('billing_hub/accounts/details')
  ) {
    return
  }
  let now = getTimeCurrent()
  let html = `
                  <div class="x1gzqxud x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1kmqopl x5yr21d xh8yej3">
                      <div class="smeta-main">
                        <div class="header popup">
                            <img src=${chrome.runtime.getURL(
                              'access/icon/logo.png'
                            )} alt="sMeta">
                            <span class="update-at">Update: ${now}<span>
                        </div>
                            <ul class="list" id="smeta-billing-list">
                                <div class="billding_load">
                                    <img src=${chrome.runtime.getURL(
                                      'access/icon/loading.gif'
                                    )}>
                                </div>
                            </ul>
                        <div class="smeta-billing-footer">

                        </div>
                      </div>
                  </div>
  `
  var sildeBilding = document.getElementsByClassName(
    'xeuugli x2lwn1j x78zum5 xdt5ytf x1iyjqo2 x2lah0s xozqiw3 x1kxxb1g xxc7z9f x1cvmir6'
  )[0]
  if (!sildeBilding) {
    return
  }
  firstChild = sildeBilding.firstChild
  if (firstChild.nodeType === Node.TEXT_NODE) {
    return
  }
  let checkisHas = document.getElementsByClassName('smeta-main')[0]
  if (checkisHas) {
    return
  }
  firstChild.insertAdjacentHTML('afterend', html)
  sildeBilding.innerHTML = `
          <div class="xeuugli x2lwn1j x78zum5 xdt5ytf x1iyjqo2 x2lah0s xozqiw3 x1kxxb1g xxc7z9f x1cvmir6 smeta_fixed">
              ${sildeBilding.innerHTML}
          </div>
      `
  let list = document.getElementById('smeta-billing-list')

  let obj = await getAdAccountInfo()
  var tempHTML = ''

  for (var info in obj) {
    var type_currency = obj.s_currency
    if (info.slice(0, 2) == 's_') {
      switch (info) {
        case 's_balance':
          tempHTML += `<li><p>${
            objBillName[info]
          }</p><div><span __smeta_ignore class='r s_balance'>${obj[
            info
          ].toLocaleString('en-US')} ${
            isNaN(obj[info]) ? '' : type_currency
          }</span><span __smeta_ignore class='g h_balance'>${
            obj['h_balance']
          } ${isNaN(obj[info]) ? '' : '$'}</span></div></li>`
          break
        case 's_adtrust_new':
          tempHTML += `<li><p>${
            objBillName[info]
          }</p><div><span __smeta_ignore class='p s_adtrust_new'>${obj[
            info
          ].toLocaleString('en-US')} ${
            isNaN(obj[info]) ? '' : type_currency
          }</span><span __smeta_ignore class='g h_adtrust_new'>${
            obj['h_adtrust_new']
          } ${isNaN(obj[info]) ? '' : '$'}</span></div></li>`
          break
        case 's_adtrust':
          tempHTML += `<li><p>${
            objBillName[info]
          }</p><div><span __smeta_ignore class='r s_adtrust'>${obj[
            info
          ].toLocaleString('en-US')} ${
            isNaN(obj[info]) ? '' : type_currency
          }</span><span __smeta_ignore class='g h_adtrust'>${
            obj['h_adtrust']
          } ${isNaN(obj[info]) ? '' : '$'}</span></div></li>`
          break
        case 's_spent':
          tempHTML += `<li><p>${
            objBillName[info]
          }</p><div><span __smeta_ignore class='r s_spent'>${obj[
            info
          ].toLocaleString('en-US')} ${
            isNaN(obj[info]) ? '' : type_currency
          }</span><span __smeta_ignore class='g h_spent'>${obj['h_spent']} ${
            isNaN(obj[info]) ? '' : '$'
          }</span></div></li>`
          break
        case 's_threshold':
          tempHTML += `<li><p>${
            objBillName[info]
          }</p><div><span __smeta_ignore class='r s_threshold'>${obj[
            info
          ].toLocaleString('en-US')} ${
            isNaN(obj[info]) ? '' : type_currency
          }</span><span __smeta_ignore class='g h_threshold'>${
            obj['h_threshold']
          } ${isNaN(obj[info]) ? '' : '$'}</span></div></li>`
          break
        default:
          tempHTML += `<li><p>${objBillName[info]}</p><p>${obj[info]}</p></li>`
      }
    }
  }
  list.innerHTML = tempHTML
}

async function reRender () {
  window['SMETA_INFO'] = null

  let triggerArr = ['balance', 'adtrust', 'adtrust_new', 'spent', 'threshold']

  for (let triger of triggerArr) {
    let s_triger = document.getElementsByClassName(`s_${triger}`)
    for (let i = 0; i <= s_triger.length - 1; i++) {
      s_triger[i].innerHTML = '<i class="fa-solid fa-spinner spinner"></i>'
    }

    let h_triger = document.getElementsByClassName(`h_${triger}`)
    for (let i = 0; i <= s_triger.length - 1; i++) {
      h_triger[i].innerHTML = '<i class="fa-solid fa-spinner spinner"></i>'
    }
  }

  let obj = getAdAccountInfo()
    .then(obj => {
      for (let triger of triggerArr) {
        let s_triger = document.getElementsByClassName(`s_${triger}`)
        for (let i = 0; i <= s_triger.length - 1; i++) {
          s_triger[i].innerText = `${obj[`s_${triger}`].toLocaleString(
            'en-US'
          )} ${isNaN(obj[`s_${triger}`]) ? '' : obj.s_currency}`
        }

        let h_triger = document.getElementsByClassName(`h_${triger}`)
        for (let i = 0; i <= s_triger.length - 1; i++) {
          h_triger[i].innerText = `${obj[`h_${triger}`]} $`
        }
      }

      let now = getTimeCurrent()
      let triggerTime = document.getElementsByClassName('update-at')
      for (let i = 0; i <= triggerTime.length - 1; i++) {
        triggerTime[i].innerHTML = `Update at: ${now}`
      }
    })
    .catch(e => console.log(e))
}

function getRateCurrent () {
  try {
    if (window['USD_RATE']) {
      return window['USD_RATE']
    }
    let html_src = document.documentElement.outerHTML
    window['USD_RATE'] = {
      rate: html_src.split('"account_currency_ratio_to_usd":')[1].split(',')[0],
      currency: html_src.split('"currency":"')[1].split('"')[0]
    }
    return window['USD_RATE']
  } catch (error) {
    return null
  }
}

async function getToken () {
  var html_src = document.documentElement.outerHTML
  regex = /"EA[A-Za-z0-9]{20,}/gm
  match = html_src.match(regex)
  var token = ''
  var fbdt = ''
  try {
    token = match[0].substr(1)
    fbdt = html_src.split('["DTSGInitData",[],{"token":"')[1].split('"')[0]
  } catch (error) {}

  obj = {
    token: token,
    fbdt: fbdt
  }
  return obj
}

function autoClose () {
  try {
    // let ftable = document.querySelector('#fmain')
    // ftable.style.opacity = 0
    // ftable.style.visibility = 'hidden'
    // ftable.style.width = '0'
  } catch (error) {}
}

let _isRunning = false

function alwaydislaySmeta () {
  let popup = document.querySelector('#smeta_offical')
  let popup_realtime = document.querySelector('#realtime')
  let lsdfe = document.querySelector('.smit-bubble')
  let dsfdssdf = document.querySelector('#smit-bubble-open')
  if (popup_realtime) {
    if (popup_realtime.style.display != 'block') {
      popup_realtime.style.display = 'block'
    }
  }
  if (popup) {
    if (popup.style.display != 'flex') {
      popup.style.display = 'flex'
    }
  }
  if (lsdfe) {
    lsdfe.style.display = 'none'
  }
  if (dsfdssdf) {
    dsfdssdf.style.display = 'none'
  }
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    smetaPopUp()
    smetaPopUpRealTime()
    smetaBilling()

    const observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          for (const child of mutation.addedNodes) {
            alwaydislaySmeta()
            smetaBilling()
            window.__smeta.convertCurrency(child)
          }
        } else if (mutation.type === 'attributes') {
          if (
            mutation.attributeName === 'style' &&
            mutation.target &&
            mutation.target.className === '_1gda _2djg'
          ) {
            window.__smeta.convertCurrency(mutation.target)
          }
        }
      }
    })
    observer.observe(window.document.body, {
      attributes: true,
      childList: true,
      subtree: true
    })
    window.__smeta.convertCurrency(document.body)
  },
  false
)

window.onload = function () {
  var linkElement = document.createElement('link')
  linkElement.rel = 'stylesheet'
  linkElement.href = chrome.runtime.getURL('access/css/fontawesome.css')
  document.head.appendChild(linkElement)

  setTimeout(autoClose, 10000)
}

window.alertGreen = function (message, timeout = null) {
  const alert = document.createElement('div')
  const alertButton = document.createElement('button')
  alertButton.innerHTML = 'OK'
  alert.classList.add('alert_green')
  alert.innerHTML = `<span >${message}</span>`
  alertButton.addEventListener('click', e => {
    alert.remove()
  })
  if (timeout != null) {
    setTimeout(() => {
      alert.remove()
    }, Number(timeout))
    document.body.appendChild(alert)
  }
}

window.alert = function (message, timeout = null) {
  const alert = document.createElement('div')
  const alertButton = document.createElement('button')
  alertButton.innerHTML = 'OK'
  alert.classList.add('alert')
  alert.innerHTML = `<span>${message}</span>`
  alert.appendChild(alertButton)
  alertButton.addEventListener('click', e => {
    alert.remove()
  })
  if (timeout != null) {
    setTimeout(() => {
      alert.remove()
    }, Number(timeout))
  }
  document.body.appendChild(alert)
}
