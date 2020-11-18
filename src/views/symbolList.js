import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Collapse, Card, CardBody, CardTitle, Badge, Button, Input, FormGroup, Label, UncontrolledAlert, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames/bind';
import { symbolsQuery, eventsMutation, updateEventsMutation } from '../queries';
import Loader from '../components/loader';
import StockTimeseries from './stockTimeseries';
import ErrorBoundary from './errorBoundary';

const SymbolList = () => {
  const [expandedStockId, setExpandedStock] = useState('');
  const [addEvent, { loading: eventMutationLoading, called, error: eventsMutationError }] = useMutation(eventsMutation);
  const [updateEvent, { called: calledUpdateEventsMutation, error: updateEventsMutationError }] = useMutation(updateEventsMutation);

  const registration = localStorage.getItem('serviceWorkerRegistration');
  let userId = null;
  if (registration) {
    userId = JSON.parse(registration).userId;
  }
  
  const { loading, error, data } = useQuery(symbolsQuery, {variables: { userId }});
  const [triggerType, setTriggerType] = useState('');
  const [triggerValue, setTriggerValue] = useState(null);
  const [isSubscribePopoverOpen, handlePopoverToggle] = useState(null);

  if (loading) return <Loader />
  if (error) return <p>Something went wrong!</p>

  const isOpen = (stockId) => {
    return expandedStockId === stockId;
  }

  const subscribeToStock = (stockId, rowId, isSubscribed) => {
    handlePopoverToggle(null);
    if (!isSubscribed) {
      addEvent({
        variables: {
          user_id: userId,
          symbol: stockId,
          triggerType,
          triggerValue: triggerType === 'time' ? 1 : triggerValue
        }
      });
    } else {
      updateEvent({
        variables: {
          id: rowId,
          triggerType,
          triggerValue: triggerType === 'time' ? 1 : triggerValue
        }
      });
    }
  }

  const renderSubscribeOptions = (id, isSubscribed, symbolTriggerData) => {
    return (
      <PopoverBody>
      {
        isSubscribed ? (
          <div className="already-subscribed">You have already subscribed but you can go ahead and edit it!</div>
        ) : null
      }
        <FormGroup check>
          <Label check>
            <Input 
              type="radio" 
              name="trigger"
              value="time"
              onChange={(e) => setTriggerType(e.target.value)}
              checked={triggerType === "time"}
            />
            Notify me every hour
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input 
              type="radio" 
              name="trigger"
              value="event"
              checked={triggerType === "event"}
              onChange={(e) => setTriggerType(e.target.value)}
            />
            Notify me when the value of this stock is 
            <Input 
              type="text" 
              disabled={!triggerType || triggerType === 'time'} 
              onChange={e => setTriggerValue(e.target.value)}
              value={triggerValue} />
          </Label>
        </FormGroup>
        <Button className="submit-button" outline onClick={() => subscribeToStock(id, symbolTriggerData.id, isSubscribed)} disabled={!triggerType}>Submit</Button>
      </PopoverBody>
    )
  }

  const setSubscribeValues = (id, symbolTriggerData) => {
    handlePopoverToggle(id);
    setTriggerType(symbolTriggerData.trigger_type);
    setTriggerValue(symbolTriggerData.trigger_value);
  }

  const renderSymbols = () => {
    return (
      <>
        {data.symbol.map((symbolData) => {
          const { id, company } = symbolData;
          const max = symbolData.stock_symbol_aggregate.aggregate.max;
          const min = symbolData.stock_symbol_aggregate.aggregate.min;
          const isSubscribed = symbolData.symbol_events.length !== 0;
          const symbolTriggerData = isSubscribed ? symbolData.symbol_events[0] : {};

          return (
            <div key={id}>
              <div className="card-container">
                <Card>
                  <CardBody>
                    <CardTitle className="card-title">
                      <span className="company-name">{company}  </span>
                        <Badge color="dark" pill>{id}</Badge>
                        <div className={classNames({'bell': true, 'disabled': isSubscribed})} id={`subscribePopover-${id}`}>
                          <FontAwesomeIcon icon={faBell} title="Subscribe" />
                        </div>
                    </CardTitle>
                    <div className="metrics">
                      <div className="metrics-row">
                        <span className="metrics-row--label">High:</span> 
                        <span className="metrics-row--value">{max.high}</span>
                        <span className="metrics-row--label">{' '}(Volume: </span> 
                        <span className="metrics-row--value">{max.volume}</span>)
                      </div>
                      <div className="metrics-row">
                        <span className="metrics-row--label">Low: </span>
                        <span className="metrics-row--value">{min.low}</span>
                        <span className="metrics-row--label">{' '}(Volume: </span>
                        <span className="metrics-row--value">{min.volume}</span>)
                      </div>
                    </div>
                    <Button className="timeseries-btn" outline onClick={() => toggleTimeseries(id)}>Timeseries</Button>{' '}
                  </CardBody>
                </Card>
                <Popover
                  className="popover-custom" 
                  placement="bottom" 
                  target={`subscribePopover-${id}`}
                  isOpen={isSubscribePopoverOpen === id}
                  toggle={() => setSubscribeValues(id, symbolTriggerData)}
                >
                  <PopoverHeader>
                    Notification Options
                    <span className="popover-close">
                      <FontAwesomeIcon 
                        icon={faTimes} 
                        onClick={() => handlePopoverToggle(null)}
                      />
                    </span>
                  </PopoverHeader>
                  {renderSubscribeOptions(id, isSubscribed, symbolTriggerData)}
                </Popover>
              </div>
              <Collapse isOpen={expandedStockId === id}>
                {
                  isOpen(id) ? <StockTimeseries symbol={id}/> : null
                }
              </Collapse>
              
            </div>
          )
        })}
        {
          eventMutationLoading ? <UncontrolledAlert color="info">Subscribing to stock...</UncontrolledAlert> : null
          
        }
        {
          (called && !eventsMutationError) || calledUpdateEventsMutation ? <UncontrolledAlert color="success">Subscription successful!</UncontrolledAlert> : null
        }
        {
          eventsMutationError || updateEventsMutationError ? <UncontrolledAlert color="danger">Error while subscribing!</UncontrolledAlert> : null
        }
      </>
    );
  }

  const toggleTimeseries = (id) => {
    id === expandedStockId ? setExpandedStock(null) : setExpandedStock(id);
  }

  return (
    <ErrorBoundary>
      {renderSymbols(data)}
    </ErrorBoundary>
  );
}

export default SymbolList;