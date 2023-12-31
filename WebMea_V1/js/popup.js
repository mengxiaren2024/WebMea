$(function(){
	// Enable/disable interception


	function sendcrawl_page() {
		console.log('[*] sendcrawl_page');
			var message = { action: "crawPage"};
			chrome.runtime.sendMessage(message, function(response) {
				console.log('[*] crawl page action has been sent');
			});
	
	}

	function sendcrawl_subpage() {
		console.log('[*] sendcrawl_subspage');
			var message = { action: "crawsubPage"};
			chrome.runtime.sendMessage(message, function(response) {
				console.log('[*] crawl subpage action has been sent');
			});
	
	}


	function setCSPHeaders() {
		var cspHeaderStatus = $('input[name=csp]:checked', '#csp-generator').val();

		CSP.browser.set({ 'cspHeaderStatus': cspHeaderStatus }, function(result){

		});

		// Tell the background.js the current CSP status
		sendCSPStatus(cspHeaderStatus);
	}

	// Saves options to chrome.storage
	function saveOptions(quiet) {
		console.log('[*] saveOptions called');
		var generatedCSPHeaders = $('#generated-csp').val();
		var cspHeaderStatus = $('input[name=csp]:checked', '#csp-generator').val();

		CSP.browser.set({ 'generatedCSPHeaders': generatedCSPHeaders }, function(result){

		});
		CSP.browser.set({ 'cspHeaderStatus': cspHeaderStatus }, function(result){

		});

		// Update status to let user know options were saved.
		if (quiet !== true ) { CSP.util.updateStatus('Options saved'); }
	}

	// Restores options state using the preferences
	// stored in chrome.storage.
	function restoreOptions() {
		chrome.storage.sync.get({
			cspHeaderStatus: 'csp-off'
		}, function(item){     // get item we currently clicked
			if (item.cspHeaderStatus) {
				$('#'+item.cspHeaderStatus).prop("checked", true);
				if (item.cspHeaderStatus == 'csp-off') {
				    CSP.browser.setIcon('off');
				} else {
					CSP.browser.setIcon('on');
				}
			} 
		})

		// Behold the nesting!
		chrome.storage.sync.get({
			cspGeneratorUrl: 'https://csp.4armed.io'
		}, function(cspUrl){
			var defaultCSPHeader = "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-uri " + cspUrl.cspGeneratorUrl + "/report;";
			chrome.storage.sync.get({
				generatedCSPHeaders: defaultCSPHeader
			}, function(items){
				$('#generated-csp').val(items.generatedCSPHeaders);
				saveOptions(true);
			});
		})

		$('#save').prop('disabled', true).addClass('btn-disabled');
	}

	function resetCSP() {
		chrome.storage.sync.get({
			cspGeneratorUrl: 'https://csp.4armed.io'
	    }, function(items) {
			var defaultCSPHeader = "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-uri " + items.cspGeneratorUrl + "/report;";
			$('#generated-csp').val(defaultCSPHeader);
		});
	}

	function sendGenerate() {
		console.log('[*] sendGenerate');
		CSP.browser.getCurrentHost(function(result){
			var message = { action: "generate", host: result };
			chrome.runtime.sendMessage(message, function(response) {
				console.log('[*] Fly my pretties!');
			});
		});
	}

	function sendCSPStatus(status) {
		console.log('[*] sendCSPStatus');
		CSP.browser.get('generatedCSPHeaders', function(item){

			chrome.runtime.sendMessage({ action: status, csp: item.generatedCSPHeaders }, function(response) {
				console.log('[*] Unleash the Kraken!');
			});
		});
	}

	chrome.runtime.onMessage.addListener(function(request, sender){
		if (request.policy) {
			$('#generated-csp').val(request.policy);//set value #generated-csp
		}
	})

	// Event Listeners

	$('#crawlPage').click(function(event) {
		event.preventDefault();
                console.log('[*] start collect Content-Security-Policy-Report');
                sendcrawl_page();
  	        $('#crawlPage').prop('disabled', true).addClass('btn-disabled');
	});


	$('#save').click(function(event) {
		event.preventDefault();
		saveOptions();
		setCSPHeaders();
		$('#save').prop('disabled', true).addClass('btn-disabled');
                $('#crawlPage').prop('disabled', false).removeClass('btn-disabled')
                $('#crawlsubPage').prop('disabled', false).removeClass('btn-disabled');
	});
	$('#generate').click(function(event) {
		event.preventDefault();
		sendGenerate();
		$('#save').prop('disabled', false).removeClass('btn-disabled');
	});
	$('#generated-csp').on('change keyup paste', function() {
		$('#save').prop('disabled', false).removeClass('btn-disabled');
	});
	$('#reset').click(function(event) {
		event.preventDefault();
		resetCSP();
		$('#save').prop('disabled', false).removeClass('btn-disabled');
		CSP.util.updateStatus('CSP Reset. Remember to save.');
	});
	$('input[name=csp]').change(function(event) {
		event.preventDefault();
		setCSPHeaders();
	});
	$( restoreOptions );//did not implement? 

});
