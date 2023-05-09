import React from 'react';
import { bool, object } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { camelize } from '../../util/string';
import { propTypes } from '../../util/types';

import PageBuilder from '../../containers/PageBuilder/PageBuilder';

import FallbackPage from './FallbackPage';
import { ASSET_NAME } from './LandingPage.duck';

const SectionUser = props => {
  const { sectionId, displayName } = props;
  return (
    <section id={sectionId}>
      <h2>{displayName}</h2>
    </section>
  );
};

export const LandingPageComponent = props => {
  const { pageAssetsData, inProgress, error, isAuthenticated, currentUser } = props;

  const pageData = pageAssetsData?.[camelize(ASSET_NAME)]?.data;
  const sectionUserName = {
    sectionId: 'authenticated-user',
    sectionType: 'customUser',
    displayName: currentUser?.attributes?.profile?.displayName,
  };
  const customSections =
    isAuthenticated && pageData ? [...pageData.sections, sectionUserName] : pageData?.sections;
  return (
    <PageBuilder
      pageAssetsData={{
        ...pageData,
        sections: customSections,
      }}
      options={{
        sectionComponents: {
          customUser: { component: SectionUser },
        },
      }}
      inProgress={inProgress}
      error={error}
      fallbackPage={<FallbackPage error={error} />}
    />
  );
};

LandingPageComponent.propTypes = {
  pageAssetsData: object,
  inProgress: bool,
  error: propTypes.error,
};

const mapStateToProps = state => {
  const { pageAssetsData, inProgress, error } = state.hostedAssets || {};
  const { isAuthenticated } = state.auth;
  const { currentUser } = state.user;
  return { pageAssetsData, inProgress, error, isAuthenticated, currentUser };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LandingPage = compose(connect(mapStateToProps))(LandingPageComponent);

export default LandingPage;
