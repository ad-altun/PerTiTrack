import axios from "axios";

interface PublicHolidaysApiResponse {
    date: string;
    localName: string | null;
    name: string | null;
    countryCode: string | null;
    fixed: boolean;
    global: boolean;
    counties: string[] | null;
    launchYear: string[] | null;
    types: string[] | null;
}


export const getPublicHolidays = async (year: string) => {
    const apiUrl: string = `https://date.nager.at/api/v3/PublicHolidays/${year}/DE`;

    return await axios.get<PublicHolidaysApiResponse[]>( apiUrl)
        .then(response => response.data)
};