import { render, screen } from '@testing-library/react';

import Counter from './counter';

describe('Counter', () => {
  it('should display the count', () => {
    render(
      <Counter
        count={5}
        onIncrement={() => {}}
        onDecrement={() => {}}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });
});