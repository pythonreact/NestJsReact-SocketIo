import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';
import { formActions } from '../store/appSlices/FormSlice';
import { useReduxDispatch } from '../store/Store';

type CustomLinkProps = {
  to: string;
  children: string;
};

type LanguageButtonProps = {
  lang: string;
};

const CustomLink: React.FC<CustomLinkProps> = ({ to, children, ...props }) => {
  const dispatch = useReduxDispatch();

  const { i18n } = useTranslation(['home', 'form', 'travel']);
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  const [isInit, setIsinit] = useState(true);

  useEffect(() => {
    if (isInit) {
      const language = window.localStorage.getItem('TRAVEL_APP_LANGUAGE');
      if (language !== null) i18n.changeLanguage(JSON.parse(language));
      dispatch(formActions.setInitAnim(true));
      setIsinit(false);
    }
  }, [i18n, isInit, dispatch]);

  return (
    <div className={`${isActive && 'text-yellow-500 group-hover:text-blue-700'}`}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </div>
  );
};

const LanguageButton: React.FC<LanguageButtonProps> = ({ lang }) => {
  const dispatch = useReduxDispatch();
  const { i18n } = useTranslation(['home', 'form', 'travel']);
  const onLanguageChange = (language: string) => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
      window.localStorage.setItem('TRAVEL_APP_LANGUAGE', JSON.stringify(language));
      dispatch(formActions.setRefreshAnim(true));
      dispatch(formActions.setInitAnim(false));
    }
  };

  const langCode = lang === 'en' ? 'GB' : 'HU';
  return (
    <button onClick={() => onLanguageChange(lang)}>
      <ReactCountryFlag className="flag__attributes" countryCode={langCode} svg />
    </button>
  );
};

const NavBar: React.FC = () => {
  return (
    <>
      <nav className="w-full bg-gradient-to-r from-blue-500 to-blue-100 hover:from-pink-500 hover:to-yellow-500 text-white flex justify-between group text-[calc(2.5vh)] h-[calc(1.7vw+3vh)]">
        <div className="pl-5 flex gap-8 items-center">
          <CustomLink to="/">Home</CustomLink>
          <CustomLink to="/travel">Travel</CustomLink>
        </div>
        <div className="pr-5 flex gap-4 items-center">
          <LanguageButton lang="en" />
          <LanguageButton lang="hu" />
        </div>
      </nav>
    </>
  );
};

export default NavBar;
