
const convert = {
    // changes weather code to String and Icon
    codeToWeather(code){
        if(code >= 200 && code <= 232) {
            return {text: "Sturm", icon: "bi bi-cloud-lightning"};
        }
        else if(code >= 300 && code <= 321) {
            return {text: "Nieselregen", icon: "bi bi-cloud-drizzle"};
        }
        else if(code >= 500 && code <= 531) {
            return {text: "Regen", icon: "bi bi-cloud-rain"};
        }
        else if(code >= 600 && code <= 622) {
            return {text: "Schnee", icon: "bi bi-snow"};
        }
        else if(code >= 700 && code <= 781) {
            return {text: "Nebel", icon: "bi bi-cloud-haze"};
        }
        else if(code === 800) {
            return {text: "Sonnig", icon: "bi bi-sun"};
        }
        else if(code >= 801 && code <= 804) {
            return {text: "Bewölkt", icon: "bi bi-cloud"};
        }
        else{
            return { text: "Fehler", icon: "bi bi-x-circle"};
        }
    },

    // changes direction in degree to String
    degreeToDirection(degree){
        if(degree >= 45 && degree < 135){
            return "Ost";
        }
        else if(degree >= 135 && degree < 225){
            return "Süd";
        }
        else if(degree >= 225 && degree < 315){
            return "West";
        }
        else if((degree >= 0 && degree < 45) || (degree >= 315 && degree <= 360)){
            return "Nord";
        }
        else{
            return "Fehler";
        }
    },

    // check if most current measurement is higher than the measurement before
    trendToSymbol(measure1, measure2){
        if(measure1 === measure2){
            return "bi bi-arrow-right";
        }
        else if(measure1 > measure2){
            return "bi bi-arrow-up-right";
        }
        else if(measure1 < measure2){
            return "bi bi-arrow-down-right";
        }
        return "";
    },

    // get the trend for temperature, wind and air pressure
    trendForStation(measurement1, measurement2){
        return {
            temperatur: this.trendToSymbol(Number(measurement1.temperatur), Number(measurement2.temperatur)),
            wind: this.trendToSymbol(Number(measurement1.wind), Number(measurement2.wind)),
            luftdruck: this.trendToSymbol(Number(measurement1.luftdruck), Number(measurement2.luftdruck))
        };
    }
};

module.exports = convert;