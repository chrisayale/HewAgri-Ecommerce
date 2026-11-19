import moment from "moment";
import { Colors } from "../colors/Colors";
import base64 from 'react-native-base64'
import { appnamecompangyname } from "../configs/configs";

export const ____WRadius = 6378137; // le rayon de la terre en m
export const __onemetreenmiles = 0.000621371;
export const ___WRayEnMiles = (____WRadius * __onemetreenmiles); // le rayon de la terre en miles
export const tries = 3;

export const convertmetreenmiles = ({ distanceenmetre }) => {
    return (parseFloat(distanceenmetre.toFixed(4)) * __onemetreenmiles).toFixed(3)
};

export const nowInUnix = () => {
    return moment(now(), 'DD-MM-YYYY').unix() || moment().unix();
};

export const returnStatus = ({ status }) => {
    switch (status) {
        case 0:
            return "En attente"
            break;
        case 1:
            return "Validée"
            break;
        case 2:
            return "En examen"
            break;
        case 3:
            return "Réjetée"
            break;
        default:
            return "Non reconnu"
            break;
    }
};

export const trucString = ({ nomItem, longueurMax }) => {
    try {
        nomItem = String(nomItem) || ""
        if (nomItem.length > longueurMax) {
            return nomItem.substring(0, longueurMax) + '...';
        }
        return nomItem;
    } catch (error) {
        return nomItem;
    }
};

export const calcYearFromMoonth = ({ moonths }) => {
    if (!Number.isInteger(moonths) || moonths < 0) {
        return "---"
    }

    const years = Math.floor(moonths / 12); // Calcul des années
    const remainingMonths = moonths % 12;  // Mois restants

    // return {
    //     years,
    //     months: remainingMonths,
    //     formatted: `${years} an(s) et ${remainingMonths} mois`,
    // };
    return `${years} an(s) et ${remainingMonths} mois`
};


export const randomString = ({ length }) => {
    return `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
};

export const groupedDataByColumn = ({ data, column }) => {
    const groupedData = {};
    data.forEach(element => {
        const transaction = element[column];
        if (groupedData[transaction]) {
            groupedData[transaction].push(element);
        } else {
            groupedData[transaction] = [element];
        }
    });
    return groupedData
};

export const renderState = ({ state }) => {
    const states = {
        0: {
            color: Colors.dangerColor,
            name: "Commande non payée"
        },
        1: {
            color: Colors.darkColor,
            name: "Commande annulée"
        },
        2: {
            color: Colors.yellow,
            name: "En cours de livraison par " + appnamecompangyname
        },
        3: {
            color: Colors.primaryColor,
            name: "Commande payée possibilité de livraison"
        },
        4: {
            color: Colors.successColor,
            name: "Commande livrée avec succès"
        }
    }
    return states[state] || "Etat non connu"
};

export const groupedItemsFromApprovi = ({ data }) => {
    const groupedData = {};
    let output = [];
    Object.keys(data).forEach(key => {
        const suffix = key.split('_').pop();
        const newKey = key.replace(`_${suffix}`, '');
        if (!groupedData[suffix]) {
            groupedData[suffix] = {};
        }
        groupedData[suffix][newKey] = data[key];
    });

    output = [...Object.values(groupedData)]

    const _data = output.map(d => {

        let { idproduit, idunity, prixachat, prixunitaire, qte, currency } = d;
        idproduit = idproduit ? parseInt(idproduit) : 0;
        prixachat = prixachat ? parseFloat(prixachat) : 0;
        prixunitaire = prixunitaire ? parseFloat(prixunitaire) : 0;
        qte = qte ? parseInt(qte) : 0;

        return {
            idproduit,
            prixachat,
            prixunitaire,
            qte
        }
    })
    return Array.from(_data)
};

export const returnInitialOfNames = ({ fsname, lsname }) => {
    if (fsname && fsname.length > 0 && lsname && lsname.length > 0) {

        fsname = fsname.toString().trim();
        lsname = lsname.toString().trim();
        return `${fsname.substring(0, 1)}${lsname.substring(0, 1)}`;

    } else {
        return "--"
    }
};

export const emailValidator = ({ email }) => {
    if ((/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/).test(email.toString().toLowerCase())) return true;
    else return false;
};

export const addDays = ({ plusDays }) => {
    return moment().add(parseInt(plusDays), 'days')
};

export const now = () => {
    return moment().format("L")
};

export const genders = [
    {
        id: "M",
        label: "Masculin"
    },
    {
        id: "F",
        label: "Feminin"
    }
];

export const formatDate = ({ date }) => {
    try {
        return moment(date).format("DD-MM-YYYY")
    } catch (error) {
        return "---"
    }
};

export const unixToDate = ({ unix }) => {
    try {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZone: 'Europe/Paris' // Définir le fuseau horaire pour la France
        };
        const date = new Date(unix * 1000)
        return moment.unix(unix).locale('fr').format('DD-MM-YYYY');
    } catch (error) {
        return "---"
    }
};

export const randomLongNumber = ({ length }) => {
    const len = length && !isNaN((length)) ? length : 6;
    const ret = [];

    for (let k = 0; k < len; k++) ret.push(
        Math.floor(Math.random() * 10)
    );

    let m = ret.join().toString();
    m = m.replace(/,/g, "");
    return m.trim();
};

export const decodeBase64 = ({ string }) => {
    try {
        let tr = string
        for (let index = 0; index < tries; index++) tr = base64.decode(tr)
        return tr
    } catch {
        return false
    }
};

export const encodeBase64 = ({ string }) => {
    try {
        let tr = string
        for (let index = 0; index < tries; index++) tr = base64.encode(tr)
        return tr
    } catch {
        return false
    }
};

export const checkIfExpired = ({ unix }) => {
    return parseInt(unix) <= nowInUnix()
};

export const belongsToThisCooperative = ({ id_cooperative }) => {
    const { idcooperative, user, token } = global;
    return parseInt(id_cooperative) === parseInt(idcooperative)
};

export const differenceBetweenDates = ({ date1, date2 }) => {
    // Différence en millisecondes
    const difference = Math.abs(date2 - date1);

    // Convertir la différence en jours, heures, minutes et secondes
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const days = Math.floor(difference / millisecondsPerDay);
    const hours = Math.floor((difference % millisecondsPerDay) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Calculer les années et les mois
    let years = date2.getFullYear() - date1.getFullYear();
    let months = date2.getMonth() - date1.getMonth();

    // Si la date finale est avant la date de départ, ajustez les années et les mois
    if (date2 < date1) {
        years -= 1;
        months += 12;
    }

    // Gérer les cas où le mois actuel est plus petit que le mois de départ
    if (date2.getDate() < date1.getDate()) {
        months -= 1;
        const lastMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
        days += lastMonth.getDate() - date1.getDate() + date2.getDate();
    }

    return { years, months, days, hours, minutes, seconds };
};

export const differenceInMonths = ({ date1, date2 }) => {
    const differenceInMs = Math.abs(date2 - date1);

    const millisecondsPerMonth = 1000 * 60 * 60 * 24 * 30.4375; // en moyenne
    const differenceInMonths = differenceInMs / millisecondsPerMonth;

    return Math.floor(differenceInMonths);
};