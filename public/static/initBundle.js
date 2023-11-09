function initBundle() {
    document.removeEventListener('DOMContentLoaded', initBundle);
    var buildFiles = window.buildJsFiles;

    setTimeout(function () {
        buildFiles.forEach(function (src) {
            var bundle = document.createElement('script');
            bundle.src = src;
            document.body.append(bundle);
        })
    }, 0);
}

document.addEventListener('DOMContentLoaded', initBundle);
