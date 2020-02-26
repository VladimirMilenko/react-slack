import React, { Component, useState, useEffect } from "react";

import { Formik, FieldArray } from "formik";

import {
  Button,
  Actions,
  Context,
  Markdown,
  Section,
  SectionText,
  SectionFields,
  SectionAccessory,
  DatePicker
} from "../slack-renderer/components";
import { useInterval } from "react-use";


const StatelessApp = () => {
  const [value, setValue] = React.useState([{ start: "", end: "" }]);
  const [step, setStep] = React.useState(0);
  useInterval(() => {
    setStep(step + 1);
  }, 200);

  const onAdd = React.useCallback(() => {
    setValue([...value, { start: "", end: "" }]);
  }, [setValue, value]);

  const onDelete = React.useCallback(
    index => {
      value.splice(index, 1);
      setValue([...value]);
    },
    [value]
  );

  return (
    <Formik
      initialValues={{ days: [{ start: "", end: "" }] }}
      onSubmit={() => {
        setStep(1);
      }}
    >
      {({ values, setFieldValue, submitForm }) => (
        <React.Fragment>
          {step === 0 && (
            <FieldArray
              name="days"
              render={arrayHelpers => {
                return (
                  <React.Fragment>
                    {values.days.map((x, index) => (
                      <Actions key={index}>
                        <DatePicker
                          onChange={({ selected_date }) => {
                            setFieldValue(`days.${index}.start`, selected_date);
                          }}
                          placeholder="Start date"
                          value={x.start}
                        />
                        <DatePicker
                          onChange={({ selected_date }) => {
                            setFieldValue(`days.${index}.end`, selected_date);
                          }}
                          placeholder="End date"
                          value={x.end}
                        />
                        <Button onClick={() => arrayHelpers.remove(index)}>
                          Delete
                          </Button>
                      </Actions>
                    ))}
                    <Actions>
                      <Button
                        onClick={() =>
                          arrayHelpers.push({ start: "", end: "" })
                        }
                      >
                        Add more
                        </Button>
                      <Button onClick={() => submitForm()}>Submit</Button>
                    </Actions>
                  </React.Fragment>
                );
              }}
            />
          )}
          {(
            <Section>
              <SectionText>
                <Markdown>*{step}*</Markdown>
              </SectionText>
              <SectionAccessory>
                <Button onClick={() => setStep(0)}>Go back</Button>
              </SectionAccessory>
            </Section>
          )}
        </React.Fragment>
      )}
    </Formik>
  );
};


export default StatelessApp;
