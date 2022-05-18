/*
 * Reducer actions related with navigation
 */
import NavigationService from '../../navigation/NavigationService';

export function navigateToHome(params) {
  NavigationService.navigate('Home', params);
}

export function navigateToForgotPassword(params) {
  NavigationService.navigate('ForgotPassword', params);
}
