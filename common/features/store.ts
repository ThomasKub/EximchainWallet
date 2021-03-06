import { bindActionCreators } from 'redux';
// import { renderToString } from 'react-dom'
import { shepherdProvider, getShepherdPending, getShepherdOffline } from 'libs/nodes';
import { configMetaActions, configMetaSelectors } from 'features/config';
import { notificationsActions } from 'features/notifications';
import handleMetaMaskPolling, { METAMASK_POLLING_INTERVAL } from './handleMetaMaskPolling';
import configureStore from './configureStore';

const store = configureStore();

window.addEventListener('load', () => {
  const getShepherdStatus = () => ({
    pending: getShepherdPending(),
    isOnline: !getShepherdOffline()
  });

  const { online, offline, lostNetworkNotif, offlineNotif, restoreNotif } = bindActionCreators(
    {
      offline: configMetaActions.setOffline,
      online: configMetaActions.setOnline,
      restoreNotif: () =>
        notificationsActions.showNotification(
          'success',
          'Your connection to the network has been restored!',
          3000
        ),
      lostNetworkNotif: () =>
        notificationsActions.showNotification(
          'danger',

          `Not connected to network. Eximchain Wallet will automatically try to reconnect when it detects an internet connection.
           If problems persist, visit eximchain.zendesk.com for help.`,
          5000
        ),

      offlineNotif: () =>
        notificationsActions.showNotification(
          'info',
          'You are currently offline. Some features will be unavailable.',
          5000
        )
    },
    store.dispatch
  );

  const getAppOnline = () => !configMetaSelectors.getOffline(store.getState());

  /**
   * @description Repeatedly polls itself to check for online state conflict occurs, implemented in recursive style for flexible polling times
   * as network requests take a variable amount of time.
   *
   * Whenever an app online state conflict occurs, it resolves the conflict with the following priority:
   * * If shepherd is online but app is offline ->  do a ping request via shepherd provider, with the result of the ping being the set app state
   * * If shepherd is offline but app is online -> set app to offline as it wont be able to make requests anyway
   */
  async function detectOnlineStateConflict() {
    const shepherdStatus = getShepherdStatus();
    const appOffline = getAppOnline();
    const onlineStateConflict = shepherdStatus.isOnline !== appOffline;
    if (shepherdStatus.pending || !onlineStateConflict) {
      return setTimeout(detectOnlineStateConflict, 1000);
    }
    // if app reports online but shepherd offline, then set app offline
    if (appOffline && !shepherdStatus.isOnline) {
      lostNetworkNotif();
      offline();
    } else if (!appOffline && shepherdStatus.isOnline) {
      // if app reports offline but shepherd reports online
      // send a request to shepherd provider to see if we can still send out requests
      const success = await shepherdProvider.ping().catch(() => false);
      if (success) {
        restoreNotif();
        online();
      }
    }
    detectOnlineStateConflict();
  }
  async function startOnlineDetect() {
    setTimeout(detectOnlineStateConflict, 500);
  }
  startOnlineDetect();
  window.addEventListener('offline', () => {
    const previouslyOnline = getAppOnline();

    // if browser reports as offline and we were previously online
    // then set offline without checking balancer state
    if (!navigator.onLine && previouslyOnline) {
      offlineNotif();
      offline();
    }
  });
});

/** @desc When MetaMask is loaded as an extension, watch for network changes. */
if ((window as any).web3) {
  setInterval(handleMetaMaskPolling.bind(null, store), METAMASK_POLLING_INTERVAL);
}

export default store;
