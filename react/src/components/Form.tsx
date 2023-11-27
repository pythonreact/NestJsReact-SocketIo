import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { authActions } from '../store/appSlices/AuthSlice';
import { useAPI } from '../logics/useAPI';
import { useReduxDispatch, useReduxSelector } from '../store/Store';
import { travelActions } from '../store/appSlices/TravelSlice';
import { AnimatedButtons } from './ui/AnimatedButtons';
import { debounce } from './ui/debounce';
import { useSocket } from '../logics/useSocket';

const Form: React.FC = () => {
  const { t, i18n } = useTranslation(['home', 'form', 'travel']);
  const textPlease = t('textPlease', { ns: ['form'] });
  const textEmail = t('textEmail', { ns: ['form'] });
  const textPassword = t('textPassword', { ns: ['form'] });
  const textSignIn = t('textSignIn', { ns: ['form'] });
  const textSignOut = t('textSignOut', { ns: ['form'] });
  const textSignUp = t('textSignUp', { ns: ['form'] });
  const textSuccesFullSignIn = t('textSuccessFullSignIn', { ns: ['form'] });
  const textSuccesFullSignOut = t('textSuccessFullSignOut', { ns: ['form'] });
  const textSuccesFullSignUp = t('textSuccessFullSignUp', { ns: ['form'] });
  const textError = t('textError', { ns: ['form'] });
  const textWelcome = t('textWelcome', { ns: ['form'] });

  const dispatch = useReduxDispatch();
  const isSignedIn = useReduxSelector((state) => state.auth.isSignedIn);
  const animatedButtonIndex = useReduxSelector((state) => state.travel.animatedButtonIndex);
  const user = useReduxSelector((state) => state.auth.user);
  const socketOrAxios = useReduxSelector((state) => state.travel.socketOrAxios);
  const changeSocketAxios = useReduxSelector((state) => state.travel.changeSocketOrAxios);
  const [value, setValue] = useState(user);
  const timeoutInstance = useRef<NodeJS.Timeout | null>(null);
  const initUser = { email: '', password: '' };

  const { userSignIn, userSignOut, userSignUp } = useAPI();
  const { userSignIn: signInSocket, userSignOut: signOutSocket, userSignUp: signUpSocket } = useSocket();

  useEffect(() => {
    if (changeSocketAxios) {
      setValue(user);
      dispatch(travelActions.setChangeSocketOrAxios(false));
    }
  }, [changeSocketAxios, dispatch, user]);

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const onSignIn = async () => {
    dispatch(travelActions.setAnimatedButtonIndex(0));
    if (isValidEmail(value.email) && value.password?.length !== 0) {
      const data = {
        email: value.email,
        password: value.password,
      };

      try {
        if (socketOrAxios !== 'socket') {
          const { token } = await userSignIn(data);
          dispatch(authActions.setAuthTokens({ token: token, refreshToken: '' }));
          dispatch(authActions.setIsSignedIn(true));
          setValue(initUser);
          toast.success(`${textSuccesFullSignIn}`);
        } else {
          signInSocket(data);
          setValue(initUser);
        }
      } catch (err) {
        return err;
      }
    } else {
      toast.error(`${textError}`);
    }
  };

  const onSignOut = async () => {
    const data = {
      email: user.email,
      password: user.password,
    };
    dispatch(travelActions.setAnimatedButtonIndex(0));
    try {
      if (socketOrAxios !== 'socket') {
        await userSignOut(data);
        dispatch(authActions.setIsSignedIn(false));
        dispatch(authActions.setAuthTokens({ token: '', refreshToken: '' }));
        dispatch(authActions.logout());
        toast.success(`${textSuccesFullSignOut}`);
      } else {
        signOutSocket(data);
      }
    } catch (err) {
      return err;
    }
  };

  const onSignUp = async () => {
    dispatch(travelActions.setAnimatedButtonIndex(0));
    if (isValidEmail(user.email) && user.password?.length !== 0) {
      const data = {
        email: user.email,
        password: user.password,
      };

      try {
        if (socketOrAxios !== 'socket') {
          const { token } = await userSignUp(data);
          dispatch(authActions.setAuthTokens({ token: token, refreshToken: '' }));
          setValue(initUser);
          toast.success(`${textSuccesFullSignUp} token: ${token}`);
        } else {
          signUpSocket(data);
          setValue(initUser);
        }
      } catch (err) {
        return err;
      }
    } else {
      toast.error(`${textError}`);
    }
  };

  const onChangeField = (eTarget: EventTarget & HTMLInputElement) => {
    setValue((value) => ({ ...value, [eTarget.name]: eTarget.value }));
    const onFunctions = {
      email: () => dispatch(authActions.setUserEmail(eTarget.value)),
      password: () => dispatch(authActions.setUserPassword(eTarget.value)),
    };
    const delay = 700;
    debounce(eTarget, delay, timeoutInstance, onFunctions);
  };

  return (
    <>
      <div className="w-full absolute flex justify-start text-[calc(2.5vh)] items-center bg-gradient-to-r from-pink-500 to-blue-100 h-[calc(7vh)]">
        {!isSignedIn ? <div className="ml-5 text-white">{textPlease} !</div> : <div className="ml-5 text-white">{textWelcome} !</div>}
        <div className="ml-5 flex">
          <input
            type="text"
            className={`pl-1 h-[calc(4.6vh)] ${i18n.language === 'en' ? 'ml-5' : 'ml-[16px]'}`}
            name="email"
            value={value.email}
            placeholder={isSignedIn ? user.email : textEmail}
            onChange={(e) => onChangeField(e.target)}
            disabled={isSignedIn}
          ></input>

          {!isSignedIn && (
            <input
              type="text"
              className="ml-5 pl-1 h-[calc(4.6vh)]"
              name="password"
              value={value.password}
              placeholder={textPassword}
              onChange={(e) => onChangeField(e.target)}
              disabled={isSignedIn}
            ></input>
          )}

          <AnimatedButtons
            isCilckAnimate={animatedButtonIndex === 4}
            onClick={() => dispatch(travelActions.setAnimatedButtonIndex(4))}
            onFunction={onSignIn}
            disabled={animatedButtonIndex === 4}
            hidden={isSignedIn}
            size="sm"
            spanClassName="text-[calc(2.5vh)] mobile:text-[calc(1vw+1vh)]"
            spanItem={textSignIn}
          />

          <AnimatedButtons
            isCilckAnimate={animatedButtonIndex === 5}
            onClick={() => dispatch(travelActions.setAnimatedButtonIndex(5))}
            onFunction={onSignOut}
            disabled={animatedButtonIndex === 5}
            hidden={!isSignedIn}
            size="sm"
            spanClassName="text-[calc(2.5vh)] mobile:text-[calc(1vw+1vh)]"
            spanItem={textSignOut}
          />

          <AnimatedButtons
            isCilckAnimate={animatedButtonIndex === 6}
            onClick={() => dispatch(travelActions.setAnimatedButtonIndex(6))}
            onFunction={onSignUp}
            disabled={animatedButtonIndex === 6}
            hidden={isSignedIn}
            size="sm"
            spanClassName="text-[calc(2.5vh)] mobile:text-[calc(1vw+1vh)]"
            spanItem={textSignUp}
          />
        </div>
      </div>
    </>
  );
};

export default Form;
