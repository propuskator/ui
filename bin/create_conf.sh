echo "
window.__CONFIG__ = {
    apiUrl           : \"${API_URL:=http://localhost:8000}\",
    apiPrefix        : \"${API_PREFIX:=/api/v1/admin/}\",
    brokerUrl        : \"${MQTT_BROKER_URI:=ws://localhost/mqtt}\",
    mqttCacheLimit   : \"${MQTT_CACHE_LIMIT:=10000}\",
    env              : \"${NODE_ENV:=local}\",
    apiUpdaterPrefix : \"${UPDATER_API_PREFIX:=/updater/v1/}\",
    apiUpdaterUrl    : \"${UPDATER_API_URL:=http://localhost}\",
    links            : {
        "playMarket" : \"${PLAY_MARKET_URL:=https://play.google.com/store/apps/details?id=com.smart.propuskator.app}\",
        "appStore"   : \"${APP_STORE_URL:=https://apps.apple.com/ua/app/propuskator/id1539003509}\"
    }
};
" > ${CONFIG_PATH:='./build/static/config.js'}