// form
import { useFormContext, useFieldArray } from 'react-hook-form';
// @mui
import { Box, Stack, Button, Divider, Typography, InputAdornment, Checkbox } from '@mui/material';
// hooks
import useLocales from '../../../../hooks/useLocales';
// components
import Iconify from '../../../../components/Iconify';
import { RHFEditor, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const ANSWERS = ['A', 'B', 'C', 'D'];

// ----------------------------------------------------------------------

export default function TestNewEditDetails() {
  const { translate } = useLocales();
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const values = watch();

  const handleAdd = () => {
    append({
      content: '',
      answers: [
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
      ],
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        spacing={2}
        direction={{ xs: 'column-reverse', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Typography variant="h6" sx={{ color: 'text.disabled' }}>
          {translate('questions')}:
        </Typography>

        <Button
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          {translate('add_new_question')}
        </Button>
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <div key={item.id}>
            {/* <RHFTextField
              name={`questions[${index}].content`}
              multiline
              rows={4}
              label={`${translate('questions')} ${index + 1}`}
            /> */}
            <RHFEditor simple id={`questions${index}content`} name={`questions[${index}].content`} />

            <Stack key={item.id} alignItems="space-between" spacing={1.5} maxWidth={'100%'}>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Stack spacing={2} sx={{ width: 1 }}>
                  {ANSWERS.map((ans, i) => (
                    <Stack key={i} direction="row" spacing={3}>
                      <RHFTextField
                        name={`questions[${index}].answers[${i}].content`}
                        label={ans}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {values.questions[index].answers[i].isCorrect
                                ? translate('is_correct_answer')
                                : null}
                              <Checkbox
                                checked={values.questions[index].answers[i].isCorrect}
                                name={`questions[${index}].answers[${i}].isCorrect`}
                                sx={{ ml: 2 }}
                                onClick={() =>
                                  setValue(
                                    `questions[${index}].answers[${i}].isCorrect`,
                                    !values.questions[index].answers[i].isCorrect
                                  )
                                }
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  ))}
                </Stack>

                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                  onClick={() => handleRemove(index)}
                  sx={{ px: 3 }}
                >
                  {translate('Delete')}
                </Button>
              </Stack>
            </Stack>
          </div>
        ))}
      </Stack>
    </Box>
  );
}
