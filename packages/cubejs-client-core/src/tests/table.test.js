import 'jest';
import ResultSet from '../ResultSet';

jest.mock('moment-range', () => {
  const Moment = jest.requireActual('moment');
  const MomentRange = jest.requireActual('moment-range');
  const moment = MomentRange.extendMoment(Moment);
  return {
    extendMoment: () => moment,
  };
});

describe('resultSet tablePivot and tableColumns', () => {
  describe('it works with one measure', () => {
    const resultSet = new ResultSet({
      query: {
        measures: ['Orders.count'],
        dimensions: ['Users.country', 'Users.gender'],
      },
      data: [
        {
          'Users.country': 'Germany',
          'Users.gender': 'male',
          'Orders.count': 10,
          'Orders.amount': 11,
        },
        {
          'Users.country': 'Germany',
          'Users.gender': 'female',
          'Orders.count': 12,
          'Orders.amount': 13,
        },
        {
          'Users.country': 'US',
          'Users.gender': 'male',
          'Orders.count': 5,
          'Orders.amount': 6,
        },
        {
          'Users.country': 'US',
          'Users.gender': 'female',
          'Orders.count': 7,
          'Orders.amount': 8,
        },
      ],
      annotation: {
        measures: {
          'Orders.count': {
            title: 'Orders Count',
            shortTitle: 'Count',
            type: 'number',
          },
          'Orders.amount': {
            title: 'Orders Amount',
            shortTitle: 'Amount',
            type: 'number',
          },
        },
        dimensions: {
          'Users.country': {
            title: 'Users Country',
            shortTitle: 'Country',
            type: 'string',
          },
          'Users.gender': {
            title: 'Users Gender',
            shortTitle: 'Gender',
            type: 'string',
          },
        },
        segments: {},
        timeDimensions: {},
      },
    });

    describe('all dimensions on `x` axis', () => {
      const pivotConfig = {
        x: ['Users.country', 'Users.gender'],
        y: ['measures'],
      };

      test('tablePivot', () => {
        expect(resultSet.tablePivot(pivotConfig)).toEqual([
          {
            'Users.country': 'Germany',
            'Users.gender': 'male',
            'Orders.count': 10,
          },
          {
            'Users.country': 'Germany',
            'Users.gender': 'female',
            'Orders.count': 12,
          },
          {
            'Users.country': 'US',
            'Users.gender': 'male',
            'Orders.count': 5,
          },
          {
            'Users.country': 'US',
            'Users.gender': 'female',
            'Orders.count': 7,
          },
        ]);
      });

      test('tableColumns', () => {
        expect(resultSet.tableColumns(pivotConfig)).toEqual([
          {
            key: 'Users.country',
            dataIndex: 'Users.country',
            title: 'Users Country',
            shortTitle: 'Country',
            type: 'string',
            format: undefined,
            meta: undefined,
          },
          {
            key: 'Users.gender',
            dataIndex: 'Users.gender',
            title: 'Users Gender',
            shortTitle: 'Gender',
            type: 'string',
            format: undefined,
            meta: undefined,
          },
          {
            key: 'Orders.count',
            dataIndex: 'Orders.count',
            title: 'Orders Count',
            shortTitle: 'Count',
            type: 'number',
            format: undefined,
            meta: undefined,
          },
        ]);
      });
    });

    describe('one dimension on `x` and one one `y` axis', () => {
      const pivotConfig = {
        x: ['Users.country'],
        y: ['Users.gender', 'measures'],
      };

      test('tablePivot', () => {
        expect(resultSet.tablePivot(pivotConfig)).toEqual([
          {
            'Users.country': 'Germany',
            'male.Orders.count': 10,
            'female.Orders.count': 12,
          },
          {
            'Users.country': 'US',
            'male.Orders.count': 5,
            'female.Orders.count': 7,
          },
        ]);
      });

      test('tableColumns', () => {
        expect(resultSet.tableColumns(pivotConfig)).toEqual([
          {
            key: 'Users.country',
            title: 'Users Country',
            shortTitle: 'Country',
            type: 'string',
            dataIndex: 'Users.country',
            format: undefined,
            meta: undefined,
          },
          {
            key: 'male',
            type: 'string',
            title: 'Users Gender Male',
            shortTitle: 'Male',
            format: undefined,
            meta: undefined,
            children: [
              {
                key: 'Orders.count',
                type: 'number',
                dataIndex: 'male.Orders.count',
                title: 'Orders Count',
                shortTitle: 'Count',
                format: undefined,
                meta: undefined,
              },
            ],
          },
          {
            key: 'female',
            type: 'string',
            title: 'Users Gender Female',
            shortTitle: 'Female',
            format: undefined,
            meta: undefined,
            children: [
              {
                key: 'Orders.count',
                type: 'number',
                dataIndex: 'female.Orders.count',
                title: 'Orders Count',
                shortTitle: 'Count',
                format: undefined,
                meta: undefined,
              },
            ],
          },
        ]);
      });
    });

    describe('all dimensions and measures on `y` axis', () => {
      const pivotConfig = {
        x: [],
        y: ['Users.country', 'Users.gender', 'measures'],
      };

      test('tablePivot', () => {
        expect(resultSet.tablePivot(pivotConfig)).toEqual([
          {
            'Germany.male.Orders.count': 10,
            'Germany.female.Orders.count': 12,
            'US.male.Orders.count': 5,
            'US.female.Orders.count': 7,
          },
        ]);
      });

      test('tableColumns', () => {
        expect(resultSet.tableColumns(pivotConfig)).toEqual([
          {
            key: 'Germany',
            type: 'string',
            title: 'Users Country Germany',
            shortTitle: 'Germany',
            meta: undefined,
            format: undefined,
            children: [
              {
                key: 'male',
                type: 'string',
                title: 'Users Gender Male',
                shortTitle: 'Male',
                meta: undefined,
                format: undefined,
                children: [
                  {
                    key: 'Orders.count',
                    type: 'number',
                    dataIndex: 'Germany.male.Orders.count',
                    title: 'Orders Count',
                    shortTitle: 'Count',
                    meta: undefined,
                    format: undefined,
                  },
                ],
              },
              {
                key: 'female',
                type: 'string',
                title: 'Users Gender Female',
                shortTitle: 'Female',
                meta: undefined,
                format: undefined,
                children: [
                  {
                    key: 'Orders.count',
                    type: 'number',
                    dataIndex: 'Germany.female.Orders.count',
                    title: 'Orders Count',
                    shortTitle: 'Count',
                    meta: undefined,
                    format: undefined,
                  },
                ],
              },
            ],
          },
          {
            key: 'US',
            type: 'string',
            title: 'Users Country US',
            shortTitle: 'US',
            meta: undefined,
            format: undefined,
            children: [
              {
                key: 'male',
                type: 'string',
                title: 'Users Gender Male',
                shortTitle: 'Male',
                meta: undefined,
                format: undefined,
                children: [
                  {
                    key: 'Orders.count',
                    type: 'number',
                    dataIndex: 'US.male.Orders.count',
                    title: 'Orders Count',
                    shortTitle: 'Count',
                    meta: undefined,
                    format: undefined,
                  },
                ],
              },
              {
                key: 'female',
                type: 'string',
                title: 'Users Gender Female',
                shortTitle: 'Female',
                meta: undefined,
                format: undefined,
                children: [
                  {
                    key: 'Orders.count',
                    type: 'number',
                    dataIndex: 'US.female.Orders.count',
                    title: 'Orders Count',
                    shortTitle: 'Count',
                    meta: undefined,
                    format: undefined,
                  },
                ],
              },
            ],
          },
        ]);
      });
    });

    test('measures on `x` axis', () => {
      const pivotConfig = {
        x: ['Users.gender', 'measures'],
        y: ['Users.country'],
      };

      expect(resultSet.tablePivot(pivotConfig)).toEqual([
        {
          'Users.gender': 'male',
          measures: 'Orders.count',
          US: 5,
          Germany: 10,
        },
        {
          'Users.gender': 'female',
          measures: 'Orders.count',
          US: 7,
          Germany: 12,
        },
      ]);
    });
  });

  describe('it works with more than one measure', () => {
    const resultSet = new ResultSet({
      query: {
        measures: ['Orders.count', 'Orders.amount'],
        dimensions: ['Users.country', 'Users.gender'],
      },
      data: [
        {
          'Users.country': 'Germany',
          'Users.gender': 'male',
          'Orders.count': 10,
          'Orders.amount': 11,
        },
        {
          'Users.country': 'Germany',
          'Users.gender': 'female',
          'Orders.count': 12,
          'Orders.amount': 13,
        },
        {
          'Users.country': 'US',
          'Users.gender': 'male',
          'Orders.count': 5,
          'Orders.amount': 6,
        },
        {
          'Users.country': 'US',
          'Users.gender': 'female',
          'Orders.count': 7,
          'Orders.amount': 8,
        },
      ],
      annotation: {
        measures: {
          'Orders.count': {
            title: 'Orders Count',
            shortTitle: 'Count',
            type: 'number',
          },
          'Orders.amount': {
            title: 'Orders Amount',
            shortTitle: 'Amount',
            type: 'number',
          },
        },
        dimensions: {
          'Users.country': {
            title: 'Users Country',
            shortTitle: 'Country',
            type: 'string',
          },
          'Users.gender': {
            title: 'Users Gender',
            shortTitle: 'Gender',
            type: 'string',
          },
        },
        segments: {},
        timeDimensions: {},
      },
    });

    test('all dimensions on `x` axis', () => {
      const pivotConfig = {
        x: ['Users.country', 'Users.gender'],
        y: ['measures'],
      };

      expect(resultSet.tablePivot(pivotConfig)).toEqual([
        {
          'Users.country': 'Germany',
          'Users.gender': 'male',
          'Orders.count': 10,
          'Orders.amount': 11,
        },
        {
          'Users.country': 'Germany',
          'Users.gender': 'female',
          'Orders.count': 12,
          'Orders.amount': 13,
        },
        {
          'Users.country': 'US',
          'Users.gender': 'male',
          'Orders.count': 5,
          'Orders.amount': 6,
        },
        {
          'Users.country': 'US',
          'Users.gender': 'female',
          'Orders.count': 7,
          'Orders.amount': 8,
        },
      ]);
    });

    test('one dimension on `x` and one one `y` axis', () => {
      const pivotConfig = {
        x: ['Users.country'],
        y: ['Users.gender', 'measures'],
      };

      expect(resultSet.tablePivot(pivotConfig)).toEqual([
        {
          'Users.country': 'Germany',
          'male.Orders.count': 10,
          'female.Orders.count': 12,
          'male.Orders.amount': 11,
          'female.Orders.amount': 13,
        },
        {
          'Users.country': 'US',
          'male.Orders.count': 5,
          'female.Orders.count': 7,
          'male.Orders.amount': 6,
          'female.Orders.amount': 8,
        },
      ]);
    });

    test('all dimensions and measures on `y` axis', () => {
      const pivotConfig = {
        x: [],
        y: ['Users.country', 'Users.gender', 'measures'],
      };

      expect(resultSet.tablePivot(pivotConfig)).toEqual([
        {
          'Germany.male.Orders.count': 10,
          'Germany.male.Orders.amount': 11,
          'Germany.female.Orders.count': 12,
          'Germany.female.Orders.amount': 13,
          'US.male.Orders.count': 5,
          'US.male.Orders.amount': 6,
          'US.female.Orders.count': 7,
          'US.female.Orders.amount': 8,
        },
      ]);
    });

    test('measures on `x` axis', () => {
      const pivotConfig = {
        x: ['Users.gender', 'measures'],
        y: ['Users.country'],
      };

      expect(resultSet.tablePivot(pivotConfig)).toEqual([
        {
          'Users.gender': 'male',
          measures: 'Orders.count',
          US: 5,
          Germany: 10,
        },
        {
          'Users.gender': 'male',
          measures: 'Orders.amount',
          US: 6,
          Germany: 11,
        },
        {
          'Users.gender': 'female',
          measures: 'Orders.count',
          US: 7,
          Germany: 12,
        },
        {
          'Users.gender': 'female',
          measures: 'Orders.amount',
          US: 8,
          Germany: 13,
        },
      ]);
    });
  });
});
