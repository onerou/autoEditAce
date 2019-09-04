const puppeteer = require('puppeteer')
const path = require('path')
const formatTime = require('./utils')
const initBrowser = async () => {
	global.browser = await puppeteer.launch({
		defaultViewport: {
			width: 1400,
			height: 930
		},
		timeout: 0, //timeout here is 无限制
		args: [ '--disable-bundled-ppapi-flash=true' ],
		devtools: true,
		//headless: false
		 headless: true
	})
	await loginAce()
}
const loginAce = async () => {
	const login = await browser.newPage()
	await login.goto('http://ace.piesat.cn/login.xhtml')
	const loginForm = await login.$('#login_form')
	await loginForm.$eval('#j_username', (userInput) => (userInput.value = 'hecheng')) // 用户名
	await loginForm.$eval('#j_password', (passInput) => (passInput.value = 'HTpwd1')) // 密码
	await loginForm.$eval('#login_btn', (loginBtn) => loginBtn.click())
	jumpTo(loginForm)
}
const jumpTo = async () => {
	const jumpTo = await browser.newPage()
	await jumpTo.goto('http://ace.piesat.cn/timesheet/fillin.xhtml')
	setTimeout(async () => {
		let date = formatTime.parseTime(new Date(), '{y}-{m}-{d}')
		console.log('TCL: jumpTo -> date', date)
		let option = require(`./workingHours/${date}.js`)
		let val = option.val
		var evalVar = {
			date,
			time: 8,
			val
		}
		await jumpTo.evaluate((evalVar) => {
			var dateTime = evalVar.date
			$(`.entry[date=${dateTime}] .hour`).val(evalVar.time)
			$(`.entry[date=${dateTime}] .hour`).focus()
			$('#entryComment').val(evalVar.val)
			$('#btnSave').click()
			$('.btn-wrap:nth-child(3)>div')[0].click()
			$('.msg-btn-inner .btn-icon[value="true"]').click()
		}, evalVar)
	}, 2000)
}
module.exports = initBrowser
