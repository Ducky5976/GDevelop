// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import MUIAccordion from '@material-ui/core/Accordion';
import MUIAccordionSummary from '@material-ui/core/AccordionSummary';
import MUIAccordionDetails from '@material-ui/core/AccordionDetails';
import MUIAccordionActions from '@material-ui/core/AccordionActions';
import IconButton from './IconButton';
import GDevelopThemeContext from './Theme/GDevelopThemeContext';
import { Column, Line } from '../UI/Grid';
import ChevronArrowRight from './CustomSvgIcons/ChevronArrowRight';

const useStylesForExpandIcon = () =>
  makeStyles(theme => ({
    root: {
      '& .MuiAccordionSummary-expandIcon.Mui-expanded': {
        transform: 'rotate(90deg)',
      },
    },
  }))();

const styles = {
  bodyRoot: {
    // Remove body padding
    padding: 0,
  },
  accordionSummaryWithExpandOnLeft: {
    flexDirection: 'row-reverse',
    paddingLeft: 0,
    paddingRight: 0,
  },
  accordionSummaryContent: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    // Avoids the summary content to overlap the expand icon that was put on the left
    marginLeft: 16,
  },
  actionsContainer: { flexGrow: 0, flexShrink: 0, alignSelf: 'center' },
};

type AccordionHeadProps = {|
  children: React.Node,
  actions?: Array<React.Node>,
  expandIcon?: React.Node,
  noMargin?: boolean,
|};

/**
 * The header of an accordion section.
 * Based on Material-UI AccordionSummary (but we could almost remove it).
 */
export const AccordionHeader = (props: AccordionHeadProps) => {
  const classes = useStylesForExpandIcon();

  return (
    <Column noMargin={props.noMargin} expand>
      <Line noMargin expand alignItems="center">
        <Column noMargin expand>
          <MUIAccordionSummary
            classes={classes}
            style={styles.accordionSummaryWithExpandOnLeft}
            expandIcon={
              props.expandIcon || (
                <IconButton size="small">
                  <ChevronArrowRight />
                </IconButton>
              )
            }
          >
            <div style={styles.accordionSummaryContent}>{props.children}</div>
          </MUIAccordionSummary>
        </Column>
        {props.actions && (
          <div style={styles.actionsContainer}>{props.actions}</div>
        )}
      </Line>
    </Column>
  );
};

type AccordionBodyProps = {|
  children: React.Node,
  style?: Object,

  // Removes all padding in body container
  disableGutters?: boolean,
|};

/**
 * The collapsible contents of an accordion section.
 * Based on Material-UI AccordionDetails.
 */
export const AccordionBody = (props: AccordionBodyProps) => {
  return (
    <MUIAccordionDetails
      style={{ ...(props.disableGutters && styles.bodyRoot), ...props.style }}
    >
      {props.children}
    </MUIAccordionDetails>
  );
};

type AccordionActionsProps = {|
  actions: Array<React.Node>,
  secondaryActions?: Array<React.Node>,
|};

/**
 * The footer of an accordion section, used to provide
 * actions specific to the accordion contents.
 * Based on Material-UI AccordionActions.
 */
export const AccordionActions = (props: AccordionActionsProps) => {
  const accordionActions = props.secondaryActions ? (
    <React.Fragment>
      <div key="secondary-actions">{props.secondaryActions}</div>
      <div key="actions">{props.actions}</div>
    </React.Fragment>
  ) : (
    props.actions
  );

  return <MUIAccordionActions>{accordionActions}</MUIAccordionActions>;
};

type AccordionProps = {|
  // AccordionSummary, AccordionBody and/or AccordionDetails
  children: React.Node,

  defaultExpanded?: boolean,
  disabled?: boolean,
  kind?: 'answer',

  // If `true`, renders body only if accordion is open
  costlyBody?: boolean,

  // Use accordion in controlled mode
  expanded?: boolean,
  onChange?: (event: any, open: boolean) => void,
  id?: string,
  noMargin?: boolean,
|};

/**
 * A block of collapsible content, with an always-shown header
 * and accordion-specific actions.
 * Based on Material-UI Accordion.
 */
export const Accordion = React.forwardRef<AccordionProps, MUIAccordion>(
  (props, ref) => {
    const { costlyBody, noMargin, kind, ...otherProps } = props;
    const gdevelopTheme = React.useContext(GDevelopThemeContext);

    const style = {
      backgroundColor:
        kind === 'answer'
          ? gdevelopTheme.message.answer.backgroundColor
          : gdevelopTheme.paper.backgroundColor.medium,
      marginLeft: 0,
      border:
        kind === 'answer'
          ? `2px solid ${gdevelopTheme.message.answer.borderColor}`
          : noMargin
          ? '0px'
          : `1px solid ${gdevelopTheme.toolbar.separatorColor}`,
      padding: noMargin ? `0px` : undefined,
      margin: noMargin ? `0px` : undefined,
      borderRadius: kind === 'answer' ? 4 : 0,
    };

    return (
      <MUIAccordion
        {...otherProps}
        ref={ref}
        square={kind !== 'answer'}
        elevation={0}
        style={style}
        TransitionProps={{ unmountOnExit: !!costlyBody }}
      />
    );
  }
);
