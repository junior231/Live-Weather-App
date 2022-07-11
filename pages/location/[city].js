import React from 'react';
import cities from '../../lib/city.list.json';
import Head from 'next/head';
import TodaysWeather from '../../components/TodaysWeather';
import moment from 'moment-timezone';
import HourlyWeather from '../../components/HourlyWeather';
import WeeklyWeather from '../../components/WeeklyWeather';
import SearchBox from '../../components/SearchBox';
import Link from 'next/link';

// use getServerSideProps because data can change constantly
export async function getServerSideProps(context) {
  const city = getCity(context.params.city);

  if (!city) {
    return {
      notFound: true,
    };
  }

  // fetch weather data from API
  const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=metric&exclude=minutely`)

  const data = await res.json();

  if(!data) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      city: city,
      timezone: data.timezone,
      currentWeather: data.current,
      dailyWeather: data.daily,
      hourlyWeather: getHourlyWeather(data.hourly, data.timezone),
    },
  };
}

const getCity = (param) => {
  // remove whitespace if any attached to slug
  const cityParam = param.trim();

  //get id of city
  // first split passed in slug into an array for every (-)
  // then grab the last element in the array which is the id
  const splitCity = cityParam.split('-');

  const id = splitCity[splitCity.length - 1];
  if (!id) {
    return null;
  }
  const city = cities.find((city) => city.id.toString() === id);

  if (city) {
    return city;
  } else {
    return null;
  }
};

const getHourlyWeather = (hourlyData, timezone) => {
  const endOfDay = moment().tz(timezone)?.endOf('day')?.valueOf();
  const eodTimeStamp = Math.floor(endOfDay / 1000)

  const todaysData = hourlyData.filter(data => data.dt < eodTimeStamp);

  return todaysData
}

export default function City({ hourlyWeather, city, currentWeather, dailyWeather, timezone }) {
  return (
    <div>
      <Head>
        <title>{city.name} Weather - Next Weather App</title>
      </Head>

      <div className='page-wrapper'>
        <div className='container' >
          <Link href='/'>
            <a className='back-link'>&larr; Home</a></Link>
          <SearchBox placeholder={'Search another location...'} />
          <TodaysWeather timezone={timezone} city={city} weather={dailyWeather[0]} /> 
          <HourlyWeather hourlyWeather={hourlyWeather} timezone={timezone} /> 
          <WeeklyWeather weeklyWeather={dailyWeather} timezone={timezone} />
        </div>  
      </div>  
 
    </div>
  );
}
