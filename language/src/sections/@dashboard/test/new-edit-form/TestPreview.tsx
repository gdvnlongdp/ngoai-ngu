// @mui
import { LoadingButton } from '@mui/lab';
import { alpha } from '@mui/material/styles';
import { Box, Card, Button, Container, Typography, DialogActions, Stack } from '@mui/material';
// @types
import { ITest } from '../../../../@types/test';
// hooks
import useLocales from '../../../../hooks/useLocales';
// redux
import { useSelector } from '../../../../redux/store';
// components
import Markdown from '../../../../components/Markdown';
import Scrollbar from '../../../../components/Scrollbar';
import EmptyContent from '../../../../components/EmptyContent';
import { DialogAnimate } from '../../../../components/animate';

import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

type Props = {
  value: ITest;
  isEdit?: boolean;
  isOpen: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  onClose: VoidFunction;
  onSubmit: VoidFunction;
};

export default function TestPreview({
  value,
  isEdit,
  isValid,
  isSubmitting,
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const { translate } = useLocales();

  const { title, channel, duration, questions } = value;

  const hasContent = value !== null;

  const { channels } = useSelector((state) => state.channel);

  const _channel = channels.find((el) => el.id === channel);

  return (
    <DialogAnimate fullScreen open={isOpen} onClose={onClose}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1, textTransform: 'uppercase' }}>
          {translate('preview')} {translate('test')}
        </Typography>
        <Button onClick={onClose} color="error">
          {translate('close')}
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isSubmitting}
          onClick={onSubmit}
        >
          {translate(isEdit ? 'update_test' : 'create_test')}
        </LoadingButton>
      </DialogActions>

      {hasContent ? (
        <Scrollbar>
          <Box
            sx={{
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            }}
          >
            <Container sx={{ pt: 1, pb: 5 }}>
              <Card sx={{ mt: 5, mx: 18 }}>
                <Box sx={{ mt: 5, mb: 10, px: 10, py: 10 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 5, textTransform: 'uppercase' }}
                    align="center"
                  >
                    {title}
                  </Typography>
                  <Stack
                    spacing={1}
                    sx={{
                      mb: 5,
                      textTransform: 'capitalize',
                    }}
                  >
                    <span>
                      {translate('Channel')}: <b>{_channel?.name}</b>
                    </span>
                    <span>
                      {translate('Duration')}: <b>{duration}</b>'
                    </span>
                  </Stack>
                  {questions.map((question, index) => (
                    <Box key={index} sx={{ mb: 5 }}>
                      <Typography
                        variant="body1"
                        sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 500 }}
                      >
                        {translate('question')} {index + 1}
                      </Typography>
                      {/* <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
                        {question.content}
                      </Typography> */}
                      <Markdown children={question.content} />

                      <FormGroup sx={{ ml: 2 }}>
                        {question.answers
                          .filter((ans) => ans.content)
                          .map((ans, index) => (
                            <FormControlLabel
                              key={index}
                              control={<Checkbox defaultChecked={ans.isCorrect} />}
                              label={ans.content}
                            />
                          ))}
                      </FormGroup>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Container>
          </Box>
        </Scrollbar>
      ) : (
        <EmptyContent title="Empty content" />
      )}
    </DialogAnimate>
  );
}
